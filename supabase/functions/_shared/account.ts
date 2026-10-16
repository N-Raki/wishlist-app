// Deleting an account: the auth user goes with every row that references it (foreign keys
// cascade), but Storage files are not part of that cascade, so the photo folder is emptied first.
// Talks to the Auth and Storage APIs directly: a few calls do not justify bundling a client library.

export function env(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const supabaseUrl = env('SUPABASE_URL');
export const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');
export const admin = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };

/** Removes every photo in the user's folder of the wish-photos bucket, a page at a time. */
async function deletePhotos(userId: string) {
  for (;;) {
    const listResponse = await fetch(`${supabaseUrl}/storage/v1/object/list/wish-photos`, {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ prefix: `${userId}/`, limit: 100 }),
    });
    if (!listResponse.ok) throw new Error(`listing photos failed: ${listResponse.status}`);
    const files: { name: string }[] = await listResponse.json();
    if (files.length === 0) return;
    const removeResponse = await fetch(`${supabaseUrl}/storage/v1/object/wish-photos`, {
      method: 'DELETE',
      headers: admin,
      body: JSON.stringify({ prefixes: files.map((file) => `${userId}/${file.name}`) }),
    });
    if (!removeResponse.ok) throw new Error(`removing photos failed: ${removeResponse.status}`);
  }
}

/** Photos first: if anything fails, the account stays and nothing is left half-deleted. */
export async function deleteAccount(userId: string) {
  await deletePhotos(userId);
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, { method: 'DELETE', headers: admin });
  if (!response.ok) throw new Error(`deleting the user failed: ${response.status} ${await response.text()}`);
}
