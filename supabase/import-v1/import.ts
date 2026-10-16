// Imports the v1 export into a v2 database, all or nothing (docs/setup.md, "Migration de la v1").
//   node supabase/import-v1/import.ts <export.json>
//   node supabase/import-v1/import.ts --undo <export.json>   (after a rehearsal in preprod)
// with DATABASE_URL set, and SUPABASE_CA (the project's SSL certificate) for a remote database.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const importSql = readFileSync(new URL('import.sql', import.meta.url), 'utf8');

export async function importV1(db: pg.Client, document: unknown) {
  await db.query('begin');
  try {
    await db.query('create temp table v1_document on commit drop as select $1::jsonb as document', [
      JSON.stringify(document),
    ]);
    const results = (await db.query(importSql)) as unknown as pg.QueryResult[];
    await db.query('commit');
    return results.at(-1)?.rows[0].report;
  } catch (error) {
    await db.query('rollback');
    throw error;
  }
}

// Removes what an import brought: the v1 accounts (and with them everything they own) and the v1
// lists merged into accounts that were already in the v2.
export async function undoImportV1(db: pg.Client, document: { users: { id: string }[]; wishlists: { id: string }[] }) {
  await db.query('begin');
  try {
    const lists = await db.query('delete from public.wishlists where id = any($1::uuid[])', [
      document.wishlists.map((list) => list.id),
    ]);
    const users = await db.query('delete from auth.users where id = any($1::uuid[])', [
      document.users.map((user) => user.id),
    ]);
    await db.query('commit');
    return { accounts: users.rowCount, wishlists: lists.rowCount };
  } catch (error) {
    await db.query('rollback');
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const undo = process.argv[2] === '--undo';
  const [file] = process.argv.slice(undo ? 3 : 2);
  const url = process.env.DATABASE_URL;
  if (!file || !url) {
    console.error('Usage: DATABASE_URL=… node supabase/import-v1/import.ts [--undo] <export.json>');
    process.exit(1);
  }
  const local = ['localhost', '127.0.0.1'].includes(new URL(url).hostname);
  const ca = process.env.SUPABASE_CA;
  if (!local && !ca) {
    console.error('SUPABASE_CA must point to the SSL certificate of the Supabase project.');
    process.exit(1);
  }
  const db = new pg.Client({ connectionString: url, ssl: ca ? { ca: readFileSync(ca, 'utf8') } : undefined });
  await db.connect();
  try {
    const document = JSON.parse(readFileSync(file, 'utf8'));
    const report = undo ? await undoImportV1(db, document) : await importV1(db, document);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await db.end();
  }
}
