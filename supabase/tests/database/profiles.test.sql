begin;
select plan(9);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'lea@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'hugo@example.test');

select is(
  (select count(*)::int from public.profiles
   where id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')),
  2,
  'A profile is created for each new account'
);

-- As Léa
set local role authenticated;
set local request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

select results_eq(
  'select id from public.profiles',
  $$ values ('11111111-1111-1111-1111-111111111111'::uuid) $$,
  'A user only sees their own profile'
);

select lives_ok(
  $$ update public.profiles set display_name = 'Léa' where id = '11111111-1111-1111-1111-111111111111' $$,
  'A user can set their display name'
);

update public.profiles set display_name = 'Pirate' where id = '22222222-2222-2222-2222-222222222222';

select throws_ok(
  $$ update public.profiles set display_name = repeat('a', 31) where id = '11111111-1111-1111-1111-111111111111' $$,
  '23514',
  null,
  'A display name is 30 characters at most'
);

select throws_ok(
  $$ update public.profiles set display_name = '   ' where id = '11111111-1111-1111-1111-111111111111' $$,
  '23514',
  null,
  'A display name cannot be blank'
);

select throws_ok(
  $$ update public.profiles set created_at = now() where id = '11111111-1111-1111-1111-111111111111' $$,
  '42501',
  null,
  'Only the display name is writable'
);

select throws_ok(
  $$ delete from public.profiles $$,
  '42501',
  null,
  'Profiles are deleted with the account, never directly'
);

reset role;

select is(
  (select display_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  null,
  'A user cannot change someone else''s profile'
);

-- Anonymous visitors
set local role anon;
select throws_ok(
  'select * from public.profiles',
  '42501',
  null,
  'Anonymous visitors cannot read profiles'
);

select * from finish();
rollback;
