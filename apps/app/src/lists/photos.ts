import { randomUUID } from 'expo-crypto';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

// Photos of wishes live in the public "wish-photos" bucket, one folder per user
// (supabase/migrations/20261011090000_wish_photos.sql).
const bucket = 'wish-photos';

/** Wide enough for a tile on any screen, small enough to stay under the bucket's 2 MB limit. */
const maxWidth = 1080;

/** A photo chosen on the device or found from a link, not uploaded yet. */
export type LocalPhoto = { uri: string; contentType: string };

const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/**
 * Lets the user pick a photo, then re-encodes it as a JPEG: that drops its metadata (EXIF,
 * location) before it ever leaves the device, and keeps it light. Null when cancelled.
 */
export async function pickPhoto(): Promise<LocalPhoto | null> {
  const result = await launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5] });
  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return null;
  const context = ImageManipulator.manipulate(asset.uri);
  if (asset.width > maxWidth) context.resize({ width: maxWidth });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
  return { uri: saved.uri, contentType: 'image/jpeg' };
}

/**
 * The photo a product page offers for sharing, found by the link-photo function. Null when
 * the page has none or cannot be read: the user can still pick one.
 */
export async function photoFromLink(url: string): Promise<LocalPhoto | null> {
  const { data, error } = await supabase.functions.invoke<{ contentType: string; base64: string }>('link-photo', {
    body: { url },
  });
  if (error || !data || !(data.contentType in extensions)) return null;
  return { uri: `data:${data.contentType};base64,${data.base64}`, contentType: data.contentType };
}

/** The bytes of a local photo: a file on the device, or the data address of a found one. */
async function bytesOf(photo: LocalPhoto): Promise<ArrayBuffer> {
  const base64 = photo.uri.startsWith('data:') ? photo.uri.slice(photo.uri.indexOf(',') + 1) : null;
  if (base64 === null) return (await fetch(photo.uri)).arrayBuffer();
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Uploads a picked photo into the user's folder and returns its path, to store on the wish. */
export async function uploadPhoto(photo: LocalPhoto): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('Not signed in');
  const path = `${data.user.id}/${randomUUID()}.${extensions[photo.contentType] ?? 'jpg'}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, await bytesOf(photo), { contentType: photo.contentType });
  if (error) throw error;
  return path;
}

/**
 * Removes photos nothing points to any more. Best effort: the wish is already saved, and a
 * leftover file is still removed with the account.
 */
export async function deletePhotos(paths: (string | null | undefined)[]) {
  const existing = paths.filter((path): path is string => Boolean(path));
  if (existing.length > 0) await supabase.storage.from(bucket).remove(existing);
}

export function photoUrl(path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
