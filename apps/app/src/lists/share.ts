import { Platform, Share } from 'react-native';
import { config } from '@/config';

export type ShareOutcome = 'shared' | 'copied' | 'dismissed';

/** Apps hand the link to the system share sheet, which can copy it too. */
export const canShare = true;
export const canCopy = false;

export function listUrl(id: string) {
  return `${config.siteUrl}/wishlists/${id}`;
}

/** The system share sheet (WhatsApp, Messages, mail…), with a ready-made message. */
export async function shareLink(message: string, url: string): Promise<ShareOutcome> {
  // iOS puts the link alongside the message; Android only takes text.
  const result = await Share.share(Platform.OS === 'ios' ? { message, url } : { message: `${message}\n${url}` });
  return result.action === Share.dismissedAction ? 'dismissed' : 'shared';
}

export async function copyLink(_url: string): Promise<void> {
  throw new Error('Copy goes through the share sheet in the apps');
}
