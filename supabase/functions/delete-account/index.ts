// GDPR right to erasure (art. 17): deletes the caller's account immediately.
// Deleting the auth user cascades to every table referencing it. Storage files are not part
// of that cascade, so the user's photo folder is emptied first.
//
// Talks to the Auth and Storage APIs directly: a few calls do not justify bundling a client library.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function env(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

const authUrl = `${env('SUPABASE_URL')}/auth/v1`;
const storageUrl = `${env('SUPABASE_URL')}/storage/v1`;
const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');
const admin = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };

/** Removes every photo in the user's folder of the wish-photos bucket, a page at a time. */
async function deletePhotos(userId: string) {
  for (;;) {
    const listResponse = await fetch(`${storageUrl}/object/list/wish-photos`, {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ prefix: `${userId}/`, limit: 100 }),
    });
    if (!listResponse.ok) throw new Error(`listing photos failed: ${listResponse.status}`);
    const files: { name: string }[] = await listResponse.json();
    if (files.length === 0) return;
    const removeResponse = await fetch(`${storageUrl}/object/wish-photos`, {
      method: 'DELETE',
      headers: admin,
      body: JSON.stringify({ prefixes: files.map((file) => `${userId}/${file.name}`) }),
    });
    if (!removeResponse.ok) throw new Error(`removing photos failed: ${removeResponse.status}`);
  }
}

function respond(status: number, error?: string) {
  return new Response(error ? JSON.stringify({ error }) : null, {
    status,
    headers: { ...corsHeaders, ...(error ? { 'Content-Type': 'application/json' } : {}) },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return respond(204);
  if (request.method !== 'POST') return respond(405, 'method_not_allowed');

  const authorization = request.headers.get('Authorization');
  if (!authorization) return respond(401, 'not_authenticated');

  // Resolves the token to a user, which also proves it is valid and not expired.
  const userResponse = await fetch(`${authUrl}/user`, {
    headers: { apikey: serviceKey, Authorization: authorization },
  });
  if (!userResponse.ok) return respond(401, 'not_authenticated');
  const { id } = await userResponse.json();

  try {
    await deletePhotos(id);
  } catch (error) {
    // The account stays, so the user can try again: nothing is left half-deleted.
    console.error('delete-account failed', error);
    return respond(500, 'deletion_failed');
  }

  const deleteResponse = await fetch(`${authUrl}/admin/users/${id}`, {
    method: 'DELETE',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!deleteResponse.ok) {
    console.error('delete-account failed', deleteResponse.status, await deleteResponse.text());
    return respond(500, 'deletion_failed');
  }

  return respond(204);
});
