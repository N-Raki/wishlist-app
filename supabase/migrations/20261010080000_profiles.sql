-- One profile per account. Holds what other people may later see about a user;
-- everything sensitive (e-mail, sign-in methods) stays in auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Null until the user picks one, right after their first sign-in.
  display_name text check (char_length(btrim(display_name)) between 1 and 30),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Grants are explicit: a table is reachable through the API only for what is granted here,
-- then RLS narrows it to the rows a user may touch.
revoke all on public.profiles from anon, authenticated;
grant select, update (display_name) on public.profiles to authenticated;

create policy "Users read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.create_profile_for_new_user() from public, anon, authenticated;

create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();
