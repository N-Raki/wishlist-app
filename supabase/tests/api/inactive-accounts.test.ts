// The daily clean-up of unused accounts (supabase/functions/inactive-accounts), against the
// local stack: activity dates are moved back in the database, and e-mails land in Mailpit.
import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import pg from 'pg';
import { API_URL, admin, signedInUser } from './helpers.ts';

const db = new pg.Client({ connectionString: process.env.DB_URL });
await db.connect();
after(() => db.end());

const run = (secret = 'local-cron-secret') =>
  fetch(`${API_URL}/functions/v1/inactive-accounts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
  });

async function makeUnused(id: string) {
  await db.query(
    `update auth.users set created_at = now() - interval '4 years', last_sign_in_at = now() - interval '4 years' where id = $1`,
    [id],
  );
  await db.query(`update auth.sessions set updated_at = now() - interval '4 years' where user_id = $1`, [id]);
}

async function noticeTo(email: string) {
  const mailpit = (process.env.MAILPIT_URL ?? process.env.INBUCKET_URL) as string;
  const search = await fetch(`${mailpit}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`);
  const { messages } = (await search.json()) as { messages: { Subject: string }[] };
  return messages.map((message) => message.Subject);
}

test('an unused account is warned by e-mail, then deleted 30 days later', async () => {
  const { id, email } = await signedInUser('Léa');
  await makeUnused(id);

  assert.equal((await run()).status, 200);
  assert.deepEqual(await noticeTo(email), ['Votre compte Wish Me sera supprimé dans 30 jours']);
  assert.ok((await admin.auth.admin.getUserById(id)).data.user, 'still there during the 30 days');

  // A second run the same day neither warns again nor deletes.
  await run();
  assert.equal((await noticeTo(email)).length, 1);

  await db.query(`update public.inactivity_notices set sent_at = now() - interval '31 days' where user_id = $1`, [id]);
  assert.equal((await run()).status, 200);
  assert.equal((await admin.auth.admin.getUserById(id)).data.user, null);
});

test('coming back after the warning keeps the account', async () => {
  const { id, email } = await signedInUser('Hugo');
  await makeUnused(id);
  await run();
  assert.equal((await noticeTo(email)).length, 1);

  await db.query(`update public.inactivity_notices set sent_at = now() - interval '31 days' where user_id = $1`, [id]);
  await db.query(`update auth.users set last_sign_in_at = now() where id = $1`, [id]);
  await run();
  assert.ok((await admin.auth.admin.getUserById(id)).data.user);
});

test('only the scheduled job can run the clean-up', async () => {
  assert.equal((await run('not-the-secret')).status, 401);
});
