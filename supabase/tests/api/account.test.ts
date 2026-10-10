// End-to-end checks of the GDPR account features through the public API,
// against the local stack (`npm run test:api`).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { API_URL, admin, PUBLISHABLE_KEY, signedInUser } from './helpers.ts';

test('a user can export their data', async () => {
  const { client, email } = await signedInUser();
  const { data, error } = await client.rpc('export_my_data');
  assert.ifError(error);
  assert.equal(data.account.email, email);
});

test('a user can delete their account, and their data goes with it', async () => {
  const { client, id } = await signedInUser();

  const { error } = await client.functions.invoke('delete-account', { method: 'POST' });
  assert.ifError(error);

  const user = await admin.auth.admin.getUserById(id);
  assert.equal(user.data.user, null);
  const profile = await admin.from('profiles').select('id').eq('id', id);
  assert.deepEqual(profile.data, []);
});

test('deleting an account requires being signed in', async () => {
  const response = await fetch(`${API_URL}/functions/v1/delete-account`, {
    method: 'POST',
    headers: { apikey: PUBLISHABLE_KEY },
  });
  assert.equal(response.status, 401);
});
