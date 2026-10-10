// End-to-end checks of the GDPR account features through the public API,
// against the local stack (`npm run test:api`).
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createClient } from '@supabase/supabase-js';

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing: run through \`npm run test:api\`, which loads the local keys.`);
  return value;
}

const API_URL = env('API_URL');
const PUBLISHABLE_KEY = env('PUBLISHABLE_KEY');
const SECRET_KEY = env('SECRET_KEY');

const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(API_URL, SECRET_KEY, options);

async function signedInUser() {
  const email = `${randomUUID()}@example.test`;
  const password = randomUUID();
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  assert.ifError(error);
  assert.ok(data.user);
  const client = createClient(API_URL, PUBLISHABLE_KEY, options);
  const signIn = await client.auth.signInWithPassword({ email, password });
  assert.ifError(signIn.error);
  return { client, email, id: data.user.id };
}

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
