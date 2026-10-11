// Finds the photo of a product from its link: fetches the page, reads the image it offers for
// sharing (Open Graph), and returns that image for the app to attach to the wish. The app
// uploads it on save, like a photo picked on the device, so nothing is stored here.
//
// The function fetches addresses chosen by users, so it only reaches public web servers:
// http(s) on default ports, names that resolve to public addresses only, redirects checked
// hop by hop, small bodies and short timeouts. Only signed-in users may call it.

import { findImageUrl, imageTypes, isPrivateAddress, parseWebUrl } from './lib.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const authUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1`;
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const maxPageBytes = 1_000_000;
const maxImageBytes = 2 * 1024 * 1024;
const maxRedirects = 3;
const timeoutMs = 6000;

class Refused extends Error {}

function respond(status: number, body: Record<string, unknown> | null) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: { ...corsHeaders, ...(body ? { 'Content-Type': 'application/json' } : {}) },
  });
}

/** Refuses a host that resolves to a private address, when the runtime can resolve names. */
async function checkHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, '');
  if (/^[\d.]+$/.test(host) || host.includes(':')) return;
  const addresses: string[] = [];
  for (const type of ['A', 'AAAA'] as const) {
    try {
      addresses.push(...(await Deno.resolveDns(host, type)));
    } catch {
      // No record of this type.
    }
  }
  if (addresses.length === 0 || addresses.some(isPrivateAddress)) throw new Refused('private_or_unknown_host');
}

/** Fetches a public address, following redirects only to other public addresses. */
async function fetchPublic(address: string, accept: string, maxBytes: number) {
  let url = parseWebUrl(address);
  for (let hop = 0; url && hop <= maxRedirects; hop++) {
    await checkHost(url.hostname);
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: accept, 'User-Agent': 'Mozilla/5.0 (compatible; WishMe/2.0; +https://wishme.fr)' },
    });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      url = parseWebUrl(new URL(location, url).href);
      continue;
    }
    if (!response.ok) throw new Refused('unreachable');
    return { response, body: await readCapped(response, maxBytes), url };
  }
  throw new Refused('invalid_url');
}

async function readCapped(response: Response, maxBytes: number) {
  const length = Number(response.headers.get('content-length') ?? 0);
  if (length > maxBytes) throw new Refused('too_large');
  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Refused('too_large');
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }
  return body;
}

function toBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return respond(204, null);
  if (request.method !== 'POST') return respond(405, { error: 'method_not_allowed' });

  const authorization = request.headers.get('Authorization');
  const user = authorization
    ? await fetch(`${authUrl}/user`, { headers: { apikey: serviceKey, Authorization: authorization } })
    : null;
  if (!user?.ok) return respond(401, { error: 'not_authenticated' });

  const { url } = await request.json().catch(() => ({}));
  if (typeof url !== 'string' || !parseWebUrl(url)) return respond(400, { error: 'invalid_url' });

  try {
    const page = await fetchPublic(url, 'text/html,application/xhtml+xml', maxPageBytes);
    const imageUrl = findImageUrl(new TextDecoder().decode(page.body), page.url.href);
    if (!imageUrl) return respond(404, { error: 'no_image' });

    const image = await fetchPublic(imageUrl, 'image/jpeg,image/png,image/webp', maxImageBytes);
    const contentType = image.response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() ?? '';
    if (!(contentType in imageTypes)) return respond(404, { error: 'no_image' });

    return respond(200, { contentType, base64: toBase64(image.body) });
  } catch (error) {
    if (error instanceof Refused) return respond(422, { error: error.message });
    // Timeouts and network failures: the page simply could not be read.
    return respond(422, { error: 'unreachable' });
  }
});
