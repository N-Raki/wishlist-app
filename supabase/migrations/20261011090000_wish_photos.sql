-- Photos of wishes (docs/spec.md, "Souhaits").
--
-- Same access model as the lists: whoever has a list's link sees its wishes, photos included.
-- Photos therefore live in a public bucket under unguessable names; nobody can list the
-- bucket, so a photo is only found through the list that shows it.
--
-- Each user writes in their own folder only (<user id>/<random>.<jpg|png|webp>), and a wish
-- can only point to a photo of its owner's folder. The app re-encodes photos taken from the
-- device before upload, which drops their metadata (EXIF, location); photos found from a
-- product link (functions/link-photo) are the shop's own pictures and are kept as they are. Files are removed by the app when a photo is replaced
-- or its wish deleted, and by delete-account for a whole account.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wish-photos', 'wish-photos', true, 2 * 1024 * 1024, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Users add photos to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'wish-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users delete photos of their own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'wish-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Deleting a file needs to see it. Each user sees their own folder only: a public bucket
-- serves files by address, so nobody needs to list anyone else's. No update policy: a new
-- photo is a new file.
create policy "Users see their own photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'wish-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

alter table public.wishes
  add column photo_path text
  check (photo_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$');

grant insert (photo_path), update (photo_path) on public.wishes to authenticated;

-- On top of "Owners manage the wishes of their lists": a wish only shows a photo of its
-- owner's folder, so nobody can attach (and later delete) someone else's photo.
create policy "Wishes only show their owner's photos"
  on public.wishes as restrictive for insert to authenticated
  with check (photo_path is null or split_part(photo_path, '/', 1) = (select auth.uid())::text);

create policy "Wishes only show their owner's photos on update"
  on public.wishes as restrictive for update to authenticated
  using (true)
  with check (photo_path is null or split_part(photo_path, '/', 1) = (select auth.uid())::text);

-- The view and the export now carry the photo.
create or replace function public.wishlist_view(wishlist_id uuid)
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
          'photo_path', w.photo_path,
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
            'photo_path', w.photo_path,
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
