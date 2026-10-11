// Pure helpers of link-photo, free of Deno APIs so the Node tests can import them.

/** Image types a wish photo may have, with the extension its file gets. */
export const imageTypes: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/**
 * A web address the function may fetch: http(s) on the default port, no credentials, and no
 * name or address that points inside a network (the function must not become a way to reach
 * private services). Null otherwise.
 */
export function parseWebUrl(input: string): URL | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    /\.(localhost|local|internal|lan|home|corp)$/.test(host) ||
    (!host.includes('.') && !host.includes(':'))
  )
    return null;
  if (isIpAddress(host) && isPrivateAddress(host)) return null;
  return url;
}

function isIpAddress(host: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':');
}

/** True for any address that is not a public unicast one: loopback, private, link-local… */
export function isPrivateAddress(address: string): boolean {
  const ip = address.toLowerCase();
  const v4 = ip.match(/^(?:::ffff:)?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  if (!ip.includes(':')) return true;
  // IPv6: only global unicast (2000::/3) is public; anything else is refused.
  if (ip.startsWith('::ffff:')) return true;
  return !/^[23][0-9a-f]{0,3}:/.test(ip);
}

/** The picture a page offers for sharing (Open Graph, then Twitter), as an absolute URL. */
export function findImageUrl(html: string, pageUrl: string): string | null {
  const head = html.slice(0, 500_000);
  for (const key of ['og:image:secure_url', 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']) {
    for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
      const name = attribute(tag, 'property') ?? attribute(tag, 'name');
      const content = attribute(tag, 'content');
      if (name?.toLowerCase() === key && content) {
        try {
          return new URL(decodeEntities(content.trim()), pageUrl).href;
        } catch {
          // A broken address: try the next tag.
        }
      }
    }
  }
  return null;
}

function attribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[2] ?? match[3] ?? match[4]) : undefined;
}

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x2F;/gi, '/');
}
