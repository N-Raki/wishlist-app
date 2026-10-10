// GDPR right to erasure (art. 17): deletes the caller's account immediately.
// Deleting the auth user cascades to every table referencing it.
// When a storage bucket starts holding user files, empty the user's folder here first:
// storage objects are not removed by the cascade.
//
// Talks to the Auth API directly: two calls do not justify bundling a client library.

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
const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');

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
