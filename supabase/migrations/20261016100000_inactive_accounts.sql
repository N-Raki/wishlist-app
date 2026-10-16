-- Accounts unused for 3 years are deleted, after an e-mail sent 30 days before (docs/legal/registre.md).
-- Once a day, supabase/functions/inactive-accounts e-mails the accounts returned here as 'warn'
-- and records the notice, then deletes those returned as 'delete'. Signing in, or simply opening
-- the app while signed in, counts as activity and cancels a pending deletion.

create table public.inactivity_notices (
  user_id uuid primary key references auth.users (id) on delete cascade,
  sent_at timestamptz not null default now()
);

-- No policy and no grant to users: only the server function, with the service role, uses it.
alter table public.inactivity_notices enable row level security;
revoke all on public.inactivity_notices from anon, authenticated;
grant select, insert, update, delete on public.inactivity_notices to service_role;

create function public.inactive_accounts(batch integer default 100)
returns table (user_id uuid, email text, locale text, action text)
language sql
stable
security definer
set search_path = ''
as $$
  with accounts as (
    select
      u.id,
      u.email,
      u.raw_user_meta_data ->> 'locale' as locale,
      -- A session's updated_at moves each time the app refreshes it.
      greatest(
        u.created_at,
        u.last_sign_in_at,
        (select max(s.updated_at) from auth.sessions s where s.user_id = u.id)
      ) as active_at,
      n.sent_at
    from auth.users u
    left join public.inactivity_notices n on n.user_id = u.id
  )
  select id, email, locale, action
  from (
    select *,
      case
        when sent_at > active_at and sent_at <= now() - interval '30 days' then 'delete'
        when active_at < now() - (interval '3 years' - interval '30 days')
          and (sent_at is null or sent_at < active_at) then 'warn'
      end as action
    from accounts
  ) due
  where action is not null
  order by active_at
  limit batch;
$$;

revoke execute on function public.inactive_accounts(integer) from public, anon, authenticated;
grant execute on function public.inactive_accounts(integer) to service_role;
