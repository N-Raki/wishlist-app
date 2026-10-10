// Shared setup for the API tests, which run against the local stack (`npm run test:api`).
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing: run through \`npm run test:api\`, which loads the local keys.`);
  return value;
}

export const API_URL = env('API_URL');
export const PUBLISHABLE_KEY = env('PUBLISHABLE_KEY');
const SECRET_KEY = env('SECRET_KEY');

const options = { auth: { persistSession: false, autoRefreshToken: false } };
export const admin = createClient(API_URL, SECRET_KEY, options);

export function anonymousClient() {
  return createClient(API_URL, PUBLISHABLE_KEY, options);
}

export async function signedInUser(displayName?: string) {
  const email = `${randomUUID()}@example.test`;
  const password = randomUUID();
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  assert.ifError(error);
  assert.ok(data.user);
  if (displayName) {
    const update = await admin.from('profiles').update({ display_name: displayName }).eq('id', data.user.id);
    assert.ifError(update.error);
  }
  const client = anonymousClient();
  const signIn = await client.auth.signInWithPassword({ email, password });
  assert.ifError(signIn.error);
  return { client, email, id: data.user.id };
}
