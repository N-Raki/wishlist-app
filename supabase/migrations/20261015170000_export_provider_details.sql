-- Google sign-in: the export includes what each provider sent about the user (name, photo, e-mail).
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
        -- Whether a password is set; never the password, which is only stored as a hash.
        'has_password', coalesce(u.encrypted_password, '') <> '',
        'sign_in_methods', coalesce(
          (select jsonb_agg(jsonb_build_object(
             'provider', i.provider,
             'linked_at', i.created_at,
             'last_sign_in_at', i.last_sign_in_at,
             'details', i.identity_data
           ) order by i.created_at)
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
