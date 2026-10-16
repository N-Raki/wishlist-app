-- Imports the v1 export (export.sql) into the v2 database, keeping every id so that links already
-- shared keep working. Run by import.ts in one transaction, after it has put the document in
-- v1_document. Running it again changes nothing: whatever is already there is left as it is.
--
-- What changes on the way (docs/v1.md, "Contraintes de migration"):
-- - Passwords are not carried over (Identity hashes are not readable by Supabase): people sign
--   in with an e-mail code, then set a new password if they want one.
-- - An e-mail used by several v1 accounts, or already used in the v2, becomes one account.
-- - Prices become cents; a link that is not a web address moves to the description.
-- - Reservations and visited lists become rows; a reservation of one's own wish is dropped.

create temp table v1_users on commit drop as
select u.*, lower(btrim(u.email)) as normalized_email
from v1_document, jsonb_to_recordset(document -> 'users') as u(
  id uuid, email text, email_confirmed boolean, display_name text, recent_wishlist_ids uuid[]
)
where coalesce(btrim(u.email), '') <> '';

create temp table v1_google on commit drop as
select g.*
from v1_document, jsonb_to_recordset(document -> 'google') as g(user_id uuid, sub text);

create temp table v1_wishlists on commit drop as
select w.*
from v1_document, jsonb_to_recordset(document -> 'wishlists') as w(
  id uuid, user_id uuid, name text, created_at timestamptz
);

create temp table v1_items on commit drop as
select i.*
from v1_document, jsonb_to_recordset(document -> 'items') as i(
  id uuid, wishlist_id uuid, name text, url text, price float8, buyer_ids uuid[], created_at timestamptz
);

-- Every v1 account and the v2 account it becomes: the v2 account already using its e-mail if
-- there is one, otherwise one of the v1 accounts with that e-mail, preferably one linked to
-- Google, then one whose e-mail was confirmed.
create temp table v1_accounts on commit drop as
select
  u.v1_id,
  coalesce(
    (select a.id from auth.users a where lower(a.email) = u.email and not a.is_sso_user limit 1),
    first_value(u.v1_id) over (partition by u.email order by u.google desc, u.confirmed desc, u.v1_id)
  ) as account_id,
  u.email,
  u.google or u.confirmed as confirmed
from (
  select
    id as v1_id,
    normalized_email as email,
    email_confirmed as confirmed,
    exists (select 1 from v1_google g where g.user_id = id) as google
  from v1_users
) u;

insert into auth.users (
  instance_id, id, aud, role, email, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select distinct on (a.account_id)
  '00000000-0000-0000-0000-000000000000', a.account_id, 'authenticated', 'authenticated', a.email,
  case when bool_or(a.confirmed) over (partition by a.account_id) then now() end,
  jsonb_build_object(
    'provider', 'email',
    'providers', case
      when exists (select 1 from v1_google g join v1_accounts o on o.v1_id = g.user_id where o.account_id = a.account_id)
        then '["email", "google"]'::jsonb
      else '["email"]'::jsonb
    end
  ),
  '{}'::jsonb, now(), now(),
  '', '', '', ''
from v1_accounts a
where not exists (select 1 from auth.users existing where existing.id = a.account_id)
order by a.account_id, a.v1_id;

-- Sign-in methods: the e-mail one for everybody, Google for those who had linked it. Google is
-- matched on its own id (sub), so it keeps working even if the Google address has changed.
insert into auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
select distinct on (u.id)
  u.id::text, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', u.email_confirmed_at is not null, 'phone_verified', false),
  'email', now(), now()
from auth.users u
where u.id in (select account_id from v1_accounts)
on conflict (provider_id, provider) do nothing;

insert into auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
select distinct on (g.sub)
  g.sub, a.account_id,
  jsonb_build_object('sub', g.sub, 'email', a.email, 'email_verified', true),
  'google', now(), now()
from v1_google g
join v1_accounts a on a.v1_id = g.user_id
order by g.sub, a.v1_id
on conflict (provider_id, provider) do nothing;

-- Profiles are created by the trigger on auth.users; a name already chosen in the v2 is kept.
update public.profiles p
set display_name = n.display_name
from (
  select distinct on (a.account_id) a.account_id, left(btrim(u.display_name), 30) as display_name
  from v1_accounts a
  join v1_users u on u.id = a.v1_id
  where coalesce(btrim(u.display_name), '') <> ''
  order by a.account_id, (a.v1_id = a.account_id) desc, a.v1_id
) n
where p.id = n.account_id and p.display_name is null;

insert into public.wishlists (id, owner_id, name, created_at)
select w.id, a.account_id, coalesce(nullif(left(btrim(w.name), 50), ''), 'Wishlist'), w.created_at
from v1_wishlists w
join v1_accounts a on a.v1_id = w.user_id
on conflict (id) do nothing;

create temp table v1_links on commit drop as
select
  i.id,
  case
    when u.url ~* '^https?://[^\s]+$' then u.url
    when u.url ~* '^[^\s:/]+\.[a-z]{2,}([/?#][^\s]*)?$' then 'https://' || u.url
  end as url,
  u.url as original
from v1_items i, lateral (select nullif(btrim(i.url), '') as url) u;

insert into public.wishes (id, wishlist_id, name, price_cents, url, description, created_at)
select
  i.id, i.wishlist_id,
  coalesce(nullif(btrim(i.name), ''), '—'),
  case
    when i.price is null or i.price = 'NaN' or i.price < 0 or i.price > 999999.99 then null
    else round(i.price::numeric * 100)::integer
  end,
  case when char_length(l.url) <= 2048 then l.url end,
  case when l.original is not null and (l.url is null or char_length(l.url) > 2048) then left(l.original, 1000) end,
  i.created_at
from v1_items i
join v1_links l on l.id = i.id
where exists (select 1 from public.wishlists w where w.id = i.wishlist_id)
on conflict (id) do nothing;

insert into public.reservations (wish_id, user_id, created_at)
select distinct w.id, a.account_id, now()
from v1_items i
cross join lateral unnest(i.buyer_ids) as buyer(id)
join v1_accounts a on a.v1_id = buyer.id
join public.wishes w on w.id = i.id
join public.wishlists l on l.id = w.wishlist_id
where l.owner_id <> a.account_id
on conflict (wish_id, user_id) do nothing;

-- The v1 appends a list when it is first opened: the last one is the most recent.
insert into public.wishlist_visits (user_id, wishlist_id, visited_at)
select distinct on (a.account_id, r.wishlist_id)
  a.account_id, r.wishlist_id,
  now() - (cardinality(u.recent_wishlist_ids) - r.position) * interval '1 second'
from v1_users u
join v1_accounts a on a.v1_id = u.id
cross join lateral unnest(u.recent_wishlist_ids) with ordinality as r(wishlist_id, position)
join public.wishlists l on l.id = r.wishlist_id
where l.owner_id <> a.account_id
order by a.account_id, r.wishlist_id, r.position desc
on conflict (user_id, wishlist_id) do nothing;

-- What import.ts prints: what the v1 had, what the v2 now holds of it, and what was adjusted.
select jsonb_build_object(
  'v1', jsonb_build_object(
    'users', (select count(*) from v1_document, jsonb_array_elements(document -> 'users')),
    'wishlists', (select count(*) from v1_wishlists),
    'items', (select count(*) from v1_items)
  ),
  'v2', jsonb_build_object(
    'accounts', (select count(distinct account_id) from v1_accounts),
    'google_links', (select count(*) from auth.identities i where i.provider = 'google' and i.provider_id in (select sub from v1_google)),
    'wishlists', (select count(*) from public.wishlists where id in (select id from v1_wishlists)),
    'wishes', (select count(*) from public.wishes where id in (select id from v1_items)),
    'reservations', (select count(*) from public.reservations where wish_id in (select id from v1_items)),
    'visited_lists', (select count(*) from public.wishlist_visits where user_id in (select account_id from v1_accounts))
  ),
  'adjusted', jsonb_build_object(
    'accounts_merged', (select count(*) from v1_accounts where v1_id <> account_id),
    'accounts_without_email', (select count(*) from v1_document, jsonb_array_elements(document -> 'users')) - (select count(*) from v1_users),
    'unconfirmed_emails', (select count(*) from (select 1 from v1_accounts group by account_id having not bool_or(confirmed)) n),
    'links_moved_to_description', (select count(*) from v1_links where original is not null and (url is null or char_length(url) > 2048)),
    'links_given_https', (select count(*) from v1_links where url is not null and url <> original),
    'orphan_wishlists', (select count(*) from v1_wishlists w where not exists (select 1 from v1_accounts a where a.v1_id = w.user_id)),
    'orphan_items', (select count(*) from v1_items i where not exists (select 1 from public.wishlists w where w.id = i.wishlist_id))
  )
) as report;
