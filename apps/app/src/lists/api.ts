import { supabase } from '@/lib/supabase';
import { deletePhotos } from './photos';

export type Wish = {
  id: string;
  name: string;
  price_cents: number | null;
  currency: string;
  url: string | null;
  description: string | null;
  /** In the wish-photos bucket; null for a wish without a photo. */
  photo_path: string | null;
  created_at: string;
  /** Only for signed-in relatives: never sent to the owner nor to anonymous visitors. */
  reservations?: { name: string | null; is_me: boolean }[];
};

/** A list as the caller may see it (see wishlist_view in the database). */
export type WishlistView = {
  id: string;
  name: string;
  created_at: string;
  owner_name: string | null;
  is_owner: boolean;
  wishes: Wish[];
};

export type WishDraft = Pick<Wish, 'name' | 'price_cents' | 'currency' | 'url' | 'description' | 'photo_path'>;

/** A list as "My lists" shows it, with its newest wishes as a preview. */
export type MyList = {
  id: string;
  name: string;
  wishCount: number;
  preview: Pick<Wish, 'id' | 'name' | 'photo_path'>[];
};

/** Wishes shown on a list's card on "My lists". */
export const previewSize = 4;

function check<T>({ data, error }: { data: T; error: unknown }): T {
  if (error) throw error;
  return data;
}

/** For calls that return rows: no error means there is data. */
function rows<T>(result: { data: T; error: unknown }): NonNullable<T> {
  const data = check(result);
  if (data === null || data === undefined) throw new Error('No data returned');
  return data;
}

export async function fetchMyLists(): Promise<MyList[]> {
  const lists = rows(
    await supabase
      .from('wishlists')
      .select('id, name, wishes(count), preview:wishes(id, name, photo_path)')
      .order('created_at', { ascending: false })
      .order('created_at', { referencedTable: 'preview', ascending: false })
      .limit(previewSize, { referencedTable: 'preview' }),
  );
  return lists.map(({ id, name, wishes, preview }) => ({ id, name, wishCount: wishes[0]?.count ?? 0, preview }));
}

/** Null when the list does not exist (or no longer does). */
export async function fetchWishlist(id: string): Promise<WishlistView | null> {
  return check(await supabase.rpc('wishlist_view', { wishlist_id: id })) as WishlistView | null;
}

export async function createList(name: string): Promise<string> {
  return rows(await supabase.from('wishlists').insert({ name }).select('id').single()).id;
}

export async function renameList(id: string, name: string) {
  check(await supabase.from('wishlists').update({ name }).eq('id', id));
}

/** Deletes a list, its wishes, then their photos (which the database cannot remove itself). */
export async function deleteList(list: Pick<WishlistView, 'id' | 'wishes'>) {
  check(await supabase.from('wishlists').delete().eq('id', list.id));
  await deletePhotos(list.wishes.map((wish) => wish.photo_path));
}

export async function addWish(wishlistId: string, wish: WishDraft) {
  check(await supabase.from('wishes').insert({ ...wish, wishlist_id: wishlistId }));
}

export async function updateWish(id: string, wish: WishDraft) {
  check(await supabase.from('wishes').update(wish).eq('id', id));
}

export async function deleteWish(wish: Pick<Wish, 'id' | 'photo_path'>) {
  check(await supabase.from('wishes').delete().eq('id', wish.id));
  await deletePhotos([wish.photo_path]);
}

/** Puts the caller on a wish of someone else's list; reserving twice changes nothing. */
export async function reserve(wishId: string) {
  const { error } = await supabase.from('reservations').insert({ wish_id: wishId });
  // 23505: already reserved, from another tab or device.
  if (error && error.code !== '23505') throw error;
}

/** The database only lets people delete their own reservations, so this removes the caller's. */
export async function cancelReservation(wishId: string) {
  check(await supabase.from('reservations').delete().eq('wish_id', wishId));
}
