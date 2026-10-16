-- Runs on the v1 database (wishme.fr) and prints one JSON document: everything the v2 needs,
-- nothing more (no password hashes, no tokens). Read by import.ts.
select json_build_object(
  'users', (
    select coalesce(json_agg(json_build_object(
      'id', u."Id",
      'email', u."Email",
      'email_confirmed', u."EmailConfirmed",
      'display_name', u."DisplayName",
      'recent_wishlist_ids', u."RecentWishlistIds"
    )), '[]')
    from "AspNetUsers" u
  ),
  'google', (
    select coalesce(json_agg(json_build_object('user_id', l."UserId", 'sub', l."ProviderKey")), '[]')
    from "AspNetUserLogins" l
    where l."LoginProvider" = 'Google'
  ),
  'wishlists', (
    select coalesce(json_agg(json_build_object(
      'id', w."Id", 'user_id', w."UserId", 'name', w."Name", 'created_at', w."CreatedAt"
    )), '[]')
    from "Wishlists" w
  ),
  'items', (
    select coalesce(json_agg(json_build_object(
      'id', i."Id",
      'wishlist_id', i."WishlistId",
      'name', i."Name",
      'url', i."Url",
      'price', i."Price",
      'buyer_ids', i."BuyerIds",
      'created_at', i."CreatedAt"
    )), '[]')
    from "Items" i
  )
);
