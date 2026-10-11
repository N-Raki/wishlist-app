-- A display name is required to create a list or reserve, and cannot be removed.
begin;
select plan(5);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'lea@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'hugo@example.test');
update public.profiles set display_name = 'Léa' where id = '11111111-1111-1111-1111-111111111111';

insert into public.wishlists (id, owner_id, name) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Noël 2026');
insert into public.wishes (id, wishlist_id, name) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Casque');

-- As Hugo, signed in but without a name yet
set local role authenticated;
set local request.jwt.claims = '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';

select throws_ok(
  $$ insert into public.wishlists (name) values ('Anniversaire') $$,
  '42501',
  null,
  'A user without a display name cannot create a list'
);

select throws_ok(
  $$ insert into public.reservations (wish_id) values ('bbbbbbbb-0000-0000-0000-000000000001') $$,
  '42501',
  null,
  'A user without a display name cannot reserve'
);

update public.profiles set display_name = 'Hugo' where id = '22222222-2222-2222-2222-222222222222';

select lives_ok(
  $$ insert into public.reservations (wish_id) values ('bbbbbbbb-0000-0000-0000-000000000001') $$,
  'Once named, a user can reserve'
);

select lives_ok(
  $$ update public.profiles set display_name = 'Hugo B.' where id = '22222222-2222-2222-2222-222222222222' $$,
  'A user can change their display name'
);

select throws_ok(
  $$ update public.profiles set display_name = null where id = '22222222-2222-2222-2222-222222222222' $$,
  '42501',
  null,
  'A user cannot remove their display name'
);

select * from finish();
rollback;
