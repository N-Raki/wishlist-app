// Deletes accounts unused for 3 years, after warning them by e-mail 30 days before
// (supabase/migrations/20261016100000_inactive_accounts.sql). Called once a day by
// .github/workflows/inactive-accounts.yml with CRON_SECRET; nobody else can call it.

import { admin, deleteAccount, env, supabaseUrl } from '../_shared/account.ts';
import { checkEmail, sendEmail } from '../_shared/email.ts';
import { inactivityNotice } from './notice.ts';

type Due = { user_id: string; email: string | null; locale: string | null; action: 'warn' | 'delete' };

const noticeDays = 30;

async function warn({ user_id, email, locale }: Due) {
  if (!email) throw new Error('no e-mail address to warn');
  const deletionOn = new Date(Date.now() + noticeDays * 24 * 60 * 60 * 1000);
  await sendEmail(inactivityNotice(email, locale, deletionOn, env('SITE_URL')));
  // Recorded only once sent: an account is never deleted without having been told.
  const response = await fetch(`${supabaseUrl}/rest/v1/inactivity_notices`, {
    method: 'POST',
    headers: { ...admin, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ user_id, sent_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(`recording the notice failed: ${response.status}`);
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  if (request.headers.get('Authorization') !== `Bearer ${env('CRON_SECRET')}`) {
    return new Response(null, { status: 401 });
  }

  try {
    await checkEmail();
  } catch (error) {
    console.error('inactive-accounts', error);
    return new Response(null, { status: 500 });
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/inactive_accounts`, {
    method: 'POST',
    headers: admin,
    body: '{}',
  });
  if (!response.ok) return new Response(null, { status: 500 });
  const due: Due[] = await response.json();

  const counts = { warned: 0, deleted: 0, failed: 0 };
  for (const account of due) {
    try {
      if (account.action === 'warn') {
        await warn(account);
        counts.warned++;
      } else {
        await deleteAccount(account.user_id);
        counts.deleted++;
      }
    } catch (error) {
      // The next run tries again; the others go ahead.
      console.error('inactive-accounts', account.action, account.user_id, error);
      counts.failed++;
    }
  }
  return Response.json(counts, { status: counts.failed ? 500 : 200 });
});
