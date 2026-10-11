import type { MiddlewareFunction } from 'expo-router/server';
import { config } from '@/config';
import { isPreviewBot, type PreviewList, previewPage } from '@/lists/preview';

// Link previews (docs/decisions/0003-apercu-des-liens.md): messaging apps fetch a shared list
// without running the app, so their crawlers get a small page with the list's Open Graph tags.
// Everyone else goes on to the app, which renders in the browser.
export const unstable_settings = {
  matcher: { methods: ['GET'], patterns: ['/wishlists/[id]'] },
};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The list as an anonymous visitor sees it: no reservations, nothing the link doesn't show. */
async function publicList(id: string): Promise<PreviewList | null> {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/wishlist_view`, {
    method: 'POST',
    headers: { apikey: config.supabaseKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ wishlist_id: id }),
    signal: AbortSignal.timeout(3000),
  });
  return response.ok ? response.json() : null;
}

const middleware: MiddlewareFunction = async (request) => {
  if (!isPreviewBot(request.headers.get('user-agent'))) return;
  const url = new URL(request.url);
  const id = url.pathname.split('/')[2] ?? '';
  if (!uuid.test(id)) return;
  try {
    const list = await publicList(id);
    if (!list) return;
    const language = request.headers.get('accept-language')?.toLowerCase().startsWith('en') ? 'en' : 'fr';
    const html = previewPage({
      list,
      url: url.href,
      language,
      photoUrl: (path) => `${config.supabaseUrl}/storage/v1/object/public/wish-photos/${path}`,
    });
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
    });
  } catch {
    // The database is out of reach: the crawler gets the app's page and its generic tags.
  }
};

export default middleware;
