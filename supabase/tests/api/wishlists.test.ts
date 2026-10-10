// The wishlist flows as the app will run them through the public API.
// The access rules themselves are covered in supabase/tests/database/wishlists.test.sql.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { admin, anonymousClient, signedInUser } from './helpers.ts';

async function listWithWish(owner: Awaited<ReturnType<typeof signedInUser>>) {
  const list = await owner.client.from('wishlists').insert({ name: 'Noël 2026' }).select('id').single();
  assert.ifError(list.error);
  const wish = await owner.client
    .from('wishes')
    .insert({ wishlist_id: list.data.id, name: 'Casque', price_cents: 34900 })
    .select('id')
    .single();
  assert.ifError(wish.error);
  return { listId: list.data.id, wishId: wish.data.id };
}

test('an owner sees their lists with their number of wishes', async () => {
  const lea = await signedInUser('Léa');
  await listWithWish(lea);

  const { data, error } = await lea.client.from('wishlists').select('name, wishes(count)');
  assert.ifError(error);
  assert.deepEqual(data, [{ name: 'Noël 2026', wishes: [{ count: 1 }] }]);
});

test('anyone with the link sees the list, without reservations', async () => {
  const lea = await signedInUser('Léa');
  const { listId } = await listWithWish(lea);

  const { data, error } = await anonymousClient().rpc('wishlist_view', { wishlist_id: listId });
  assert.ifError(error);
  assert.equal(data.owner_name, 'Léa');
  assert.equal(data.wishes[0].name, 'Casque');
  assert.equal('reservations' in data.wishes[0], false);
});

test('a relative reserves, sees it, and cancels; the owner never knows', async () => {
  const lea = await signedInUser('Léa');
  const hugo = await signedInUser('Hugo');
  const { listId, wishId } = await listWithWish(lea);

  const reserve = await hugo.client.from('reservations').insert({ wish_id: wishId });
  assert.ifError(reserve.error);

  const asHugo = await hugo.client.rpc('wishlist_view', { wishlist_id: listId });
  assert.deepEqual(asHugo.data.wishes[0].reservations, [{ name: 'Hugo', is_me: true }]);

  const asLea = await lea.client.rpc('wishlist_view', { wishlist_id: listId });
  assert.equal('reservations' in asLea.data.wishes[0], false);

  const visited = await hugo.client.rpc('visited_wishlists');
  assert.deepEqual(
    visited.data?.map(({ wishlist_id, owner_name }) => ({ wishlist_id, owner_name })),
    [{ wishlist_id: listId, owner_name: 'Léa' }],
  );

  const cancel = await hugo.client.from('reservations').delete().eq('wish_id', wishId);
  assert.ifError(cancel.error);
  const after = await hugo.client.rpc('wishlist_view', { wishlist_id: listId });
  assert.deepEqual(after.data.wishes[0].reservations, []);
});

test('deleting an account deletes its lists', async () => {
  const lea = await signedInUser('Léa');
  const { listId } = await listWithWish(lea);

  const { error } = await lea.client.functions.invoke('delete-account', { method: 'POST' });
  assert.ifError(error);

  const view = await anonymousClient().rpc('wishlist_view', { wishlist_id: listId });
  assert.equal(view.data, null);
  const wishes = await admin.from('wishes').select('id').eq('wishlist_id', listId);
  assert.deepEqual(wishes.data, []);
});
