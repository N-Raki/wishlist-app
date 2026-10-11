import type { ShareOutcome } from './share';

// Phones and some desktops have a share sheet; every browser can copy.
export const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
export const canCopy = true;

/** The address this site is served from, so previews and preprod share their own links. */
export function listUrl(id: string) {
  return `${window.location.origin}/wishlists/${id}`;
}

/** The browser's share sheet, where `canShare`. */
export async function shareLink(message: string, url: string): Promise<ShareOutcome> {
  try {
    await navigator.share({ text: message, url });
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'dismissed';
    throw error;
  }
}

export async function copyLink(url: string) {
  await navigator.clipboard.writeText(url);
}
