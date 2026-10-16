// The v1 → v2 migration (supabase/import-v1): a small v1 database is rebuilt in a scratch schema,
// exported with export.sql exactly as on the v1 server, then imported into the local stack.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import pg from 'pg';
import { importV1, undoImportV1 } from '../../import-v1/import.ts';
import { admin, anonymousClient, signedInUser } from './helpers.ts';

const db = new pg.Client({ connectionString: process.env.DB_URL });
await db.connect();

const id = () => randomUUID();
const alice = { id: id(), email: `alice-${id()}@example.test` };
const bob = { id: id(), email: `bob-${id()}@example.test`, sub: `google-${id()}` };
const bobAgain = { id: id(), email: bob.email.toUpperCase() };
const eve = { id: id(), email: `eve-${id()}@example.test` };
const dana = { id: id(), email: `dana-${id()}@example.test` };
const lists = { alice: id(), bob: id(), bobAgain: id(), dana: id(), missing: id() };
const wishes = { linked: id(), bare: id(), text: id(), odd: id() };
let danaInV2: string;

async function exportV1() {
  await db.query(`
    create schema v1_fixture;
    set search_path = v1_fixture;
    create table "AspNetUsers" (
      "Id" uuid primary key, "Email" varchar(256), "EmailConfirmed" boolean not null,
      "DisplayName" varchar(30) not null, "RecentWishlistIds" uuid[] not null, "PasswordHash" text
    );
    create table "AspNetUserLogins" ("LoginProvider" text, "ProviderKey" text, "UserId" uuid);
    create table "Wishlists" ("Id" uuid primary key, "UserId" uuid, "Name" varchar(30) not null, "CreatedAt" timestamptz not null);
    create table "Items" (
      "Id" uuid primary key, "WishlistId" uuid, "Name" varchar(255) not null, "Url" varchar(2048),
      "Price" real, "BuyerIds" uuid[] not null, "CreatedAt" timestamptz not null
    );
  `);
  await db.query(
    `insert into "AspNetUsers" values
      ($1, $2, true, 'Alice', '{}', 'AQAAAAIAAYagAAAAE…'),
      ($3, $4, false, ' Bob ', array[$9, $10, $11]::uuid[], null),
      ($5, $6, true, 'Bobby', '{}', null),
      ($7, $8, false, 'Eve', '{}', null),
      ($12, $13, true, 'Dana v1', '{}', null)`,
    [
      alice.id,
      alice.email,
      bob.id,
      bob.email,
      bobAgain.id,
      bobAgain.email,
      eve.id,
      eve.email,
      lists.alice,
      lists.bob,
      lists.missing,
      dana.id,
      dana.email,
    ],
  );
  await db.query(`insert into "AspNetUserLogins" values ('Google', $1, $2)`, [bob.sub, bob.id]);
  await db.query(
    `insert into "Wishlists" values
      ($1, $2, 'Noël', '2024-11-02T10:00:00Z'), ($3, $4, 'Bob', now()), ($5, $6, '   ', now()), ($7, $8, 'Dana', now())`,
    [lists.alice, alice.id, lists.bob, bob.id, lists.bobAgain, bobAgain.id, lists.dana, dana.id],
  );
  await db.query(
    `insert into "Items" values
      ($1, $5, 'Livre', 'https://example.com/livre', 19.99, array[$6, $6, $7]::uuid[], now()),
      ($2, $5, 'Sac', 'amazon.fr/sac', null, '{}', now()),
      ($3, $5, 'Plaid', 'celui de la boutique rue Victor-Hugo', 'NaN', '{}', now()),
      ($4, $5, '  ', null, -5, '{}', now())`,
    [wishes.linked, wishes.bare, wishes.text, wishes.odd, lists.alice, bob.id, alice.id],
  );
  const { rows } = await db.query(readFileSync(new URL('../../import-v1/export.sql', import.meta.url), 'utf8'));
  await db.query('reset search_path; drop schema v1_fixture cascade');
  // Goes through text, as it does from the v1 server to the import.
  return JSON.parse(JSON.stringify(Object.values(rows[0])[0]));
}

let report: Record<string, Record<string, number>>;
let document: unknown;

before(async () => {
  danaInV2 = (await signedInUser('Dana v2')).id;
  await db.query('update auth.users set email = $1 where id = $2', [dana.email, danaInV2]);
  document = await exportV1();
  report = await importV1(db, document);
});

after(async () => {
  for (const user of [alice.id, bob.id, eve.id, danaInV2]) await admin.auth.admin.deleteUser(user);
  await db.end();
});

test('every account, list and wish comes over, with its id', () => {
  assert.deepEqual(report.v1, { users: 5, wishlists: 4, items: 4 });
  assert.deepEqual(report.v2, {
    accounts: 4,
    google_links: 1,
    wishlists: 4,
    wishes: 4,
    reservations: 1,
    visited_lists: 1,
  });
  assert.deepEqual(report.adjusted, {
    accounts_merged: 2,
    accounts_without_email: 0,
    unconfirmed_emails: 1,
    links_moved_to_description: 1,
    links_given_https: 1,
    orphan_wishlists: 0,
    orphan_items: 0,
  });
});

test('a shared link still opens the list, with prices in cents and links made safe', async () => {
  const { data, error } = await anonymousClient().rpc('wishlist_view', { wishlist_id: lists.alice });
  assert.ifError(error);
  const view = data as { name: string; owner_name: string; wishes: Record<string, unknown>[] };
  assert.equal(view.name, 'Noël');
  assert.equal(view.owner_name, 'Alice');
  const byId = Object.fromEntries(view.wishes.map((wish) => [wish.id, wish]));
  assert.equal(byId[wishes.linked].price_cents, 1999);
  assert.equal(byId[wishes.linked].url, 'https://example.com/livre');
  assert.equal(byId[wishes.bare].url, 'https://amazon.fr/sac');
  assert.equal(byId[wishes.text].url, null);
  assert.equal(byId[wishes.text].description, 'celui de la boutique rue Victor-Hugo');
  assert.equal(byId[wishes.text].price_cents, null);
  assert.equal(byId[wishes.odd].name, '—');
  assert.equal(byId[wishes.odd].price_cents, null);
});

test('reservations and visited lists become rows, without reserving one’s own wish', async () => {
  const reservations = await db.query('select user_id from public.reservations where wish_id = $1', [wishes.linked]);
  assert.deepEqual(reservations.rows, [{ user_id: bob.id }]);
  const visits = await db.query('select wishlist_id from public.wishlist_visits where user_id = $1', [bob.id]);
  assert.deepEqual(visits.rows, [{ wishlist_id: lists.alice }]);
});

test('one e-mail makes one account, and a name chosen in the v2 is kept', async () => {
  const owners = await db.query('select id, owner_id, name from public.wishlists where id = any($1) order by name', [
    [lists.bobAgain, lists.dana],
  ]);
  assert.deepEqual(owners.rows, [
    { id: lists.dana, owner_id: danaInV2, name: 'Dana' },
    { id: lists.bobAgain, owner_id: bob.id, name: 'Wishlist' },
  ]);
  const names = await db.query('select id, display_name from public.profiles where id = any($1)', [[bob.id, danaInV2]]);
  assert.deepEqual(Object.fromEntries(names.rows.map((row) => [row.id, row.display_name])), {
    [bob.id]: 'Bob',
    [danaInV2]: 'Dana v2',
  });
});

test('Google stays linked, passwords are left behind', async () => {
  const identities = await db.query(
    `select provider, provider_id from auth.identities where user_id = $1 order by provider`,
    [bob.id],
  );
  assert.deepEqual(identities.rows, [
    { provider: 'email', provider_id: bob.id },
    { provider: 'google', provider_id: bob.sub },
  ]);
  const passwords = await db.query(
    `select count(*)::int as n from auth.users where id = $1 and encrypted_password is not null and encrypted_password <> ''`,
    [alice.id],
  );
  assert.equal(passwords.rows[0].n, 0);
});

test('an account whose e-mail the v1 never confirmed signs in with a code', async () => {
  const client = anonymousClient();
  const sent = await client.auth.signInWithOtp({ email: eve.email, options: { shouldCreateUser: false } });
  assert.ifError(sent.error);
  const mailpit = (process.env.MAILPIT_URL ?? process.env.INBUCKET_URL) as string;
  const search = await fetch(`${mailpit}/api/v1/search?query=${encodeURIComponent(`to:"${eve.email}"`)}`);
  const { messages } = (await search.json()) as { messages: { ID: string }[] };
  const message = (await (await fetch(`${mailpit}/api/v1/message/${messages[0].ID}`)).json()) as { Text: string };
  const code = message.Text.match(/\b\d{6,10}\b/)?.[0];
  assert.ok(code, 'a code in the e-mail');
  const verified = await client.auth.verifyOtp({ email: eve.email, token: code, type: 'email' });
  assert.ifError(verified.error);
  assert.equal(verified.data.user?.id, eve.id);
});

test('running it again changes nothing', async () => {
  assert.deepEqual(await importV1(db, document), report);
});

test('undoing a rehearsal removes the v1 accounts and lists, and only them', async () => {
  assert.deepEqual(await undoImportV1(db, document as Parameters<typeof undoImportV1>[1]), {
    accounts: 3,
    wishlists: 4,
  });
  const left = await db.query('select id from auth.users where id = any($1)', [[alice.id, bob.id, eve.id, danaInV2]]);
  assert.deepEqual(left.rows, [{ id: danaInV2 }]);
  const wishes = await db.query('select count(*)::int as n from public.wishes where wishlist_id = any($1)', [
    Object.values(lists),
  ]);
  assert.equal(wishes.rows[0].n, 0);
});
