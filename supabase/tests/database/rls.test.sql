-- Guard rail: no table in the exposed schema may ship without row level security.
begin;
select plan(1);

select is_empty(
  $$ select c.relname::text
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity $$,
  'Every table in public has RLS enabled'
);

select * from finish();
rollback;
