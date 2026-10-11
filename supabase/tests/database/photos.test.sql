-- Access rules of wish photos: a public bucket, written by each user in their own folder only.
-- Deleting files goes through the Storage API (tests/api/photos.test.ts).
begin;
select plan(11);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'lea@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'hugo@example.test');
insert into public.wishlists (id, owner_id, name) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Noël 2026');
insert into public.wishes (id, wishlist_id, name) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Casque');

select is(
  (select public from storage.buckets where id = 'wish-photos'),
  true,
  'Photos are served by address to anyone who has the list'
);

-- As Léa, the owner
set local role authenticated;
set local request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

select lives_ok(
  $$ insert into storage.objects (bucket_id, name)
     values ('wish-photos', '11111111-1111-1111-1111-111111111111/cccccccc-0000-0000-0000-000000000001.jpg') $$,
  'A user can add a photo to their own folder'
);

select throws_ok(
  $$ insert into storage.objects (bucket_id, name)
     values ('wish-photos', '22222222-2222-2222-2222-222222222222/cccccccc-0000-0000-0000-000000000002.jpg') $$,
  '42501',
  null,
  'Nobody can add a photo to someone else''s folder'
);

select lives_ok(
  $$ update public.wishes
     set photo_path = '11111111-1111-1111-1111-111111111111/cccccccc-0000-0000-0000-000000000001.jpg'
     where id = 'bbbbbbbb-0000-0000-0000-000000000001' $$,
  'The owner can give a wish one of their photos'
);

select throws_ok(
  $$ update public.wishes
     set photo_path = '22222222-2222-2222-2222-222222222222/cccccccc-0000-0000-0000-000000000002.jpg'
     where id = 'bbbbbbbb-0000-0000-0000-000000000001' $$,
  '42501',
  null,
  'A wish cannot show a photo of someone else''s folder'
);

select throws_ok(
  $$ insert into public.wishes (wishlist_id, name, photo_path) values (
       'aaaaaaaa-0000-0000-0000-000000000001', 'Piège',
       '22222222-2222-2222-2222-222222222222/cccccccc-0000-0000-0000-000000000002.jpg') $$,
  '42501',
  null,
  'Not even when adding the wish'
);

select throws_ok(
  $$ update public.wishes set photo_path = '11111111-1111-1111-1111-111111111111/../x.jpg'
     where id = 'bbbbbbbb-0000-0000-0000-000000000001' $$,
  '23514',
  null,
  'A photo path has exactly the shape the app writes'
);

select is(
  public.wishlist_view('aaaaaaaa-0000-0000-0000-000000000001') #>> '{wishes,0,photo_path}',
  '11111111-1111-1111-1111-111111111111/cccccccc-0000-0000-0000-000000000001.jpg',
  'A list shows the photos of its wishes'
);

select is(
  public.export_my_data() #>> '{wishlists,0,wishes,0,photo_path}',
  '11111111-1111-1111-1111-111111111111/cccccccc-0000-0000-0000-000000000001.jpg',
  'The export names the photo of each wish'
);

select is(
  (select count(*)::int from storage.objects where bucket_id = 'wish-photos'),
  1,
  'A user sees the photos of their own folder'
);

-- As Hugo
set local request.jwt.claims = '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';

select is_empty(
  $$ select name from storage.objects where bucket_id = 'wish-photos' $$,
  'Nobody can list someone else''s photos'
);

select * from finish();
rollback;
