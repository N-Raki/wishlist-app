import { supabase } from '@/lib/supabase';

export type Wish = {
  id: string;
  name: string;
  price_cents: number | null;
  currency: string;
  url: string | null;
  description: string | null;
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

export type WishDraft = Pick<Wish, 'name' | 'price_cents' | 'currency' | 'url' | 'description'>;

/** A list as "My lists" shows it, with its newest wishes as a preview. */
export type MyList = { id: string; name: string; wishCount: number; preview: { id: string; name: string }[] };

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
      .select('id, name, wishes(count), preview:wishes(id, name)')
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

export async function deleteList(id: string) {
  check(await supabase.from('wishlists').delete().eq('id', id));
}

export async function addWish(wishlistId: string, wish: WishDraft) {
  check(await supabase.from('wishes').insert({ ...wish, wishlist_id: wishlistId }));
}

export async function updateWish(id: string, wish: WishDraft) {
  check(await supabase.from('wishes').update(wish).eq('id', id));
}

export async function deleteWish(id: string) {
  check(await supabase.from('wishes').delete().eq('id', id));
}
