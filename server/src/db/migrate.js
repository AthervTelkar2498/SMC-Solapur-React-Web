import { query } from './pool.js';

async function run() {
  // Ensure pgcrypto is present for gen_random_uuid()
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await query(`
    create table if not exists batches (
      id uuid default gen_random_uuid() primary key,
      name text not null,
      start_date date,
      end_date date,
      created_at timestamptz default now()
    );
  `);

  await query(`
    create table if not exists applications (
      id uuid default gen_random_uuid() primary key,
      batch_id uuid references batches(id) on delete cascade,
      sr_no text,
      proposal_number text,
      proposal_code text,
      transaction_date date,
      service_name text,
      owner_name text,
      site_address text,
      pending_by text,
      designation text,
      application_received_date date,
      days integer,
      status text,
      raw jsonb,
      created_at timestamptz default now()
    );
    create index if not exists idx_applications_batch on applications(batch_id);
    create index if not exists idx_applications_status on applications(status);
    create index if not exists idx_applications_created_at on applications(created_at);
  `);

  // eslint-disable-next-line no-console
  console.log('Migration completed');
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
