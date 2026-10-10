begin;
select plan(4);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'lea@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'hugo@example.test');
update public.profiles set display_name = 'Léa' where id = '11111111-1111-1111-1111-111111111111';

set local role authenticated;
set local request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

select is(
  public.export_my_data() -> 'account' ->> 'email',
  'lea@example.test',
  'The export contains the account of the caller'
);

select is(
  public.export_my_data() -> 'profile' ->> 'display_name',
  'Léa',
  'The export contains the profile of the caller'
);

-- Update this list whenever a table with personal data is added.
select is(
  (select array_agg(k order by k) from jsonb_object_keys(public.export_my_data()) k),
  array['account', 'exported_at', 'profile'],
  'The export covers every kind of personal data we store'
);

set local role anon;
select throws_ok(
  'select public.export_my_data()',
  '42501',
  null,
  'Anonymous visitors cannot export anything'
);

select * from finish();
rollback;
