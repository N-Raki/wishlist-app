// Wish photos as the app stores them. The access rules are in tests/database/photos.test.sql.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { admin, anonymousClient, signedInUser } from './helpers.ts';

// The smallest valid JPEG is enough: the bucket only checks the type and size.
const jpeg = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
  'base64',
);

async function upload(user: Awaited<ReturnType<typeof signedInUser>>, folder = user.id) {
  const path = `${folder}/${randomUUID()}.jpg`;
  const { error } = await user.client.storage.from('wish-photos').upload(path, jpeg, { contentType: 'image/jpeg' });
  return { path, error };
}

test('an owner uploads a photo that anyone with the list can see', async () => {
  const lea = await signedInUser('Léa');
  const { path, error } = await upload(lea);
  assert.ifError(error);

  const url = anonymousClient().storage.from('wish-photos').getPublicUrl(path).data.publicUrl;
  const response = await fetch(url);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/jpeg');
});

test('nobody uploads into someone else’s folder, nor anything but a JPEG', async () => {
  const lea = await signedInUser('Léa');
  const hugo = await signedInUser('Hugo');
  assert.ok((await upload(hugo, lea.id)).error);

  const { error } = await hugo.client.storage
    .from('wish-photos')
    .upload(`${hugo.id}/${randomUUID()}.jpg`, Buffer.from('<svg/>'), { contentType: 'image/svg+xml' });
  assert.ok(error);
});

test('only the owner can delete a photo', async () => {
  const lea = await signedInUser('Léa');
  const hugo = await signedInUser('Hugo');
  const { path } = await upload(lea);

  await hugo.client.storage.from('wish-photos').remove([path]);
  assert.equal((await admin.storage.from('wish-photos').list(lea.id)).data?.length, 1);

  const { error } = await lea.client.storage.from('wish-photos').remove([path]);
  assert.ifError(error);
  assert.equal((await admin.storage.from('wish-photos').list(lea.id)).data?.length, 0);
});

test('deleting an account deletes its photos', async () => {
  const lea = await signedInUser('Léa');
  await upload(lea);
  await upload(lea);

  const { error } = await lea.client.functions.invoke('delete-account', { method: 'POST' });
  assert.ifError(error);
  assert.equal((await admin.storage.from('wish-photos').list(lea.id)).data?.length, 0);
});
