-- Wishlists, wishes, reservations and visited lists (docs/spec.md, version 2.0).
--
-- Access model: knowing a list's id is what gives access to it ("the link is enough").
-- Tables are therefore only readable by their owner; everyone else goes through
-- wishlist_view(id), which needs the id and never lets anyone enumerate lists.
--
-- The surprise rule lives here, not in the app: wishlist_view never returns
-- reservations to the list's owner nor to anonymous visitors (otherwise the owner
-- would only have to sign out to see them), and reservations are otherwise only
-- readable by the person who made them.

create table public.wishlists (
  -- Ids from the v1 are kept on migration, so links already shared keep working.
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 50),
  created_at timestamptz not null default now()
);

create index wishlists_owner_id_created_at_idx on public.wishlists (owner_id, created_at desc);

create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  -- 255 is the v1 limit, kept so that every existing wish migrates as is.
  name text not null check (char_length(btrim(name)) between 1 and 255),
  -- Money is an integer number of cents, never a float.
  price_cents integer check (price_cents between 0 and 99999999),
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  -- Only web links: anything else (javascript:, data:…) could run code when opened.
  url text check (char_length(url) <= 2048 and url ~* '^https?://[^\s]+$'),
  description text check (char_length(description) <= 1000),
  created_at timestamptz not null default now()
);

create index wishes_wishlist_id_created_at_idx on public.wishes (wishlist_id, created_at desc);

-- One row per relative positioned on a wish. Several relatives on the same wish make a
-- shared gift; the primary key stops anyone from reserving the same wish twice.
create table public.reservations (
  wish_id uuid not null references public.wishes (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (wish_id, user_id)
);

create index reservations_user_id_idx on public.reservations (user_id);

-- Lists of other people a signed-in user has opened: the "Relatives" tab.
-- Only written by wishlist_view and only read through visited_wishlists().
create table public.wishlist_visits (
  user_id uuid not null references public.profiles (id) on delete cascade,
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  visited_at timestamptz not null default now(),
  primary key (user_id, wishlist_id)
);

create index wishlist_visits_wishlist_id_idx on public.wishlist_visits (wishlist_id);

alter table public.wishlists enable row level security;
alter table public.wishes enable row level security;
alter table public.reservations enable row level security;
alter table public.wishlist_visits enable row level security;

revoke all on public.wishlists, public.wishes, public.reservations, public.wishlist_visits from anon, authenticated;

-- Wishlists: the owner manages them. The owner is always the caller (owner_id is not
-- writable), and a list cannot change hands.
grant select, insert (name), update (name), delete on public.wishlists to authenticated;

create policy "Owners manage their wishlists"
  on public.wishlists for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

-- Wishes: only the owner of the list may read or change them directly (the v1 let any
-- signed-in user add wishes to anyone's list). A wish cannot move to another list.
grant select, insert (wishlist_id, name, price_cents, currency, url, description),
  update (name, price_cents, currency, url, description), delete
  on public.wishes to authenticated;

create policy "Owners manage the wishes of their lists"
  on public.wishes for all to authenticated
  using (exists (
    select 1 from public.wishlists l
    where l.id = wishlist_id and l.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.wishlists l
    where l.id = wishlist_id and l.owner_id = (select auth.uid())
  ));

-- Reservations: a relative reserves and cancels for themselves only.
grant select, insert (wish_id), delete on public.reservations to authenticated;

create policy "Users see their own reservations"
  on public.reservations for select to authenticated
  using ((select auth.uid()) = user_id);

-- The owner can see their own wishes, so this check is what keeps them from reserving
-- one: for anyone else the subquery finds nothing.
create policy "Relatives reserve wishes of lists they do not own"
  on public.reservations for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and not exists (
      select 1 from public.wishes w join public.wishlists l on l.id = w.wishlist_id
      where w.id = wish_id and l.owner_id = (select auth.uid())
    )
  );

create policy "Users cancel their own reservations"
  on public.reservations for delete to authenticated
  using ((select auth.uid()) = user_id);

-- wishlist_visits has no grant and no policy: only the functions below touch it.

-- A list as the caller may see it, or null if it does not exist.
-- Everyone gets the list, its owner's name and its wishes, newest first. Only signed-in
-- relatives also get who reserved what. Opening someone else's list while signed in
-- records it among the caller's visited lists.
create function public.wishlist_view(wishlist_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  list public.wishlists;
  is_owner boolean;
  is_relative boolean;
begin
  select * into list from public.wishlists l where l.id = wishlist_view.wishlist_id;
  if not found then
    return null;
  end if;

  is_owner := uid is not null and uid = list.owner_id;
  is_relative := uid is not null and not is_owner;

  if is_relative then
    insert into public.wishlist_visits (user_id, wishlist_id) values (uid, list.id)
    on conflict on constraint wishlist_visits_pkey do update set visited_at = excluded.visited_at;
  end if;

  return jsonb_build_object(
    'id', list.id,
    'name', list.name,
    'created_at', list.created_at,
    'owner_name', (select p.display_name from public.profiles p where p.id = list.owner_id),
    'is_owner', is_owner,
    'wishes', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', w.id,
          'name', w.name,
          'price_cents', w.price_cents,
          'currency', w.currency,
          'url', w.url,
          'description', w.description,
          'created_at', w.created_at
        ) || case when is_relative then jsonb_build_object('reservations', coalesce((
          select jsonb_agg(
            jsonb_build_object('name', p.display_name, 'is_me', r.user_id = uid)
            order by r.created_at, r.user_id
          )
          from public.reservations r join public.profiles p on p.id = r.user_id
          where r.wish_id = w.id
        ), '[]'::jsonb)) else '{}'::jsonb end
        order by w.created_at desc, w.id
      )
      from public.wishes w where w.wishlist_id = list.id
    ), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.wishlist_view(uuid) from public;
grant execute on function public.wishlist_view(uuid) to anon, authenticated;

-- The caller's visited lists, most recently opened first, for the "Relatives" tab.
-- The app groups them by owner.
create function public.visited_wishlists()
returns table (
  wishlist_id uuid,
  name text,
  owner_id uuid,
  owner_name text,
  wish_count integer,
  visited_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select l.id, l.name, l.owner_id, p.display_name,
    (select count(*)::integer from public.wishes w where w.wishlist_id = l.id),
    v.visited_at
  from public.wishlist_visits v
  join public.wishlists l on l.id = v.wishlist_id
  join public.profiles p on p.id = l.owner_id
  where v.user_id = auth.uid()
  order by v.visited_at desc, l.id;
$$;

revoke execute on function public.visited_wishlists() from public, anon;
grant execute on function public.visited_wishlists() to authenticated;

-- The export now covers lists, wishes, reservations and visited lists.
-- Other people's data is left out: only the names of the lists the caller reserved on
-- or opened, which the caller already sees in the app.
create or replace function public.export_my_data()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'exported_at', now(),
    'account', (
      select jsonb_build_object(
        'id', u.id,
        'email', u.email,
        'created_at', u.created_at,
        'last_sign_in_at', u.last_sign_in_at,
        'sign_in_methods', coalesce(
          (select jsonb_agg(jsonb_build_object('provider', i.provider, 'linked_at', i.created_at) order by i.created_at)
           from auth.identities i where i.user_id = u.id),
          '[]'::jsonb
        )
      )
      from auth.users u where u.id = uid
    ),
    'profile', (
      select jsonb_build_object('display_name', p.display_name, 'created_at', p.created_at)
      from public.profiles p where p.id = uid
    ),
    'wishlists', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'name', l.name,
        'created_at', l.created_at,
        'wishes', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', w.id,
            'name', w.name,
            'price_cents', w.price_cents,
            'currency', w.currency,
            'url', w.url,
            'description', w.description,
            'created_at', w.created_at
          ) order by w.created_at)
          from public.wishes w where w.wishlist_id = l.id
        ), '[]'::jsonb)
      ) order by l.created_at)
      from public.wishlists l where l.owner_id = uid
    ), '[]'::jsonb),
    'reservations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'wishlist_id', l.id,
        'wishlist_name', l.name,
        'wish_name', w.name,
        'reserved_at', r.created_at
      ) order by r.created_at)
      from public.reservations r
      join public.wishes w on w.id = r.wish_id
      join public.wishlists l on l.id = w.wishlist_id
      where r.user_id = uid
    ), '[]'::jsonb),
    'visited_wishlists', coalesce((
      select jsonb_agg(jsonb_build_object(
        'wishlist_id', l.id,
        'wishlist_name', l.name,
        'visited_at', v.visited_at
      ) order by v.visited_at)
      from public.wishlist_visits v join public.wishlists l on l.id = v.wishlist_id
      where v.user_id = uid
    ), '[]'::jsonb)
  );
end;
$$;
