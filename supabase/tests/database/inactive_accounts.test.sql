begin;
select plan(8);

-- a: new account. b: unused for 4 years. c: warned 31 days ago, still unused.
-- d: warned 10 days ago. e: warned 40 days ago, signed in since. f: old sign-in, recent session.
insert into auth.users (id, email, created_at, last_sign_in_at) values
  ('a0000000-0000-0000-0000-000000000000', 'a@example.test', now(), now()),
  ('b0000000-0000-0000-0000-000000000000', 'b@example.test', now() - interval '4 years', now() - interval '4 years'),
  ('c0000000-0000-0000-0000-000000000000', 'c@example.test', now() - interval '4 years', now() - interval '4 years'),
  ('d0000000-0000-0000-0000-000000000000', 'd@example.test', now() - interval '4 years', now() - interval '4 years'),
  ('e0000000-0000-0000-0000-000000000000', 'e@example.test', now() - interval '4 years', now() - interval '5 days'),
  ('f0000000-0000-0000-0000-000000000000', 'f@example.test', now() - interval '4 years', now() - interval '4 years');
insert into auth.sessions (id, user_id, created_at, updated_at) values
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000000', now() - interval '4 years', now() - interval '1 day');
insert into public.inactivity_notices (user_id, sent_at) values
  ('c0000000-0000-0000-0000-000000000000', now() - interval '31 days'),
  ('d0000000-0000-0000-0000-000000000000', now() - interval '10 days'),
  ('e0000000-0000-0000-0000-000000000000', now() - interval '40 days');

select results_eq(
  $$ select email, action from public.inactive_accounts() where email like '_@example.test' order by email $$,
  $$ values ('b@example.test', 'warn'), ('c@example.test', 'delete') $$,
  'Accounts unused for 3 years are warned first, then deleted 30 days after the warning'
);

select is(
  (select count(*)::int from public.inactive_accounts(1)),
  1,
  'Each run handles a bounded batch'
);

set local role authenticated;
set local request.jwt.claims = '{"sub": "c0000000-0000-0000-0000-000000000000", "role": "authenticated"}';

select ok(
  public.export_my_data() -> 'account' ->> 'inactivity_notice_sent_at' is not null,
  'The export says when the inactivity warning was sent'
);

select throws_ok(
  'select * from public.inactive_accounts()',
  '42501',
  null,
  'Users cannot list inactive accounts'
);

select throws_ok(
  'select * from public.inactivity_notices',
  '42501',
  null,
  'Users cannot read the notices'
);

select throws_ok(
  $$ delete from public.inactivity_notices where user_id = 'c0000000-0000-0000-0000-000000000000' $$,
  '42501',
  null,
  'Users cannot cancel a notice by hand'
);

set local role anon;

select throws_ok(
  'select * from public.inactive_accounts()',
  '42501',
  null,
  'Visitors cannot list inactive accounts'
);

select throws_ok(
  'select * from public.inactivity_notices',
  '42501',
  null,
  'Visitors cannot read the notices'
);

select * from finish();
rollback;
