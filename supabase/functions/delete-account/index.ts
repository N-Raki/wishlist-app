// GDPR right to erasure (art. 17): deletes the caller's account immediately.

import { deleteAccount, serviceKey, supabaseUrl } from '../_shared/account.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: authorization },
  });
  if (!userResponse.ok) return respond(401, 'not_authenticated');
  const { id } = await userResponse.json();

  try {
    await deleteAccount(id);
  } catch (error) {
    // The account stays, so the user can try again.
    console.error('delete-account failed', error);
    return respond(500, 'deletion_failed');
  }
  return respond(204);
});
