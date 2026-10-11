-- A display name is required (docs/spec.md): relatives must know who reserved, and a shared
-- list must say whose it is. The app asks for it right after the first sign-in; these rules
-- make sure nothing gets in without one, whatever the client.

create function public.has_display_name()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and display_name is not null
  );
$$;

revoke execute on function public.has_display_name() from public, anon;
grant execute on function public.has_display_name() to authenticated;

-- Restrictive: added on top of the existing policies, never instead of them.
create policy "Only users with a display name create lists"
  on public.wishlists as restrictive for insert to authenticated
  with check ((select public.has_display_name()));

create policy "Only users with a display name reserve"
  on public.reservations as restrictive for insert to authenticated
  with check ((select public.has_display_name()));

-- Once chosen, a name can change but never go back to none.
create policy "A display name cannot be removed"
  on public.profiles as restrictive for update to authenticated
  with check (display_name is not null);
