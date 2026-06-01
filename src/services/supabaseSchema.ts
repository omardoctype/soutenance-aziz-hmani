// Copy and run this SQL in your Supabase SQL Editor to create the memories table and policies.
// This project uses Supabase only as a free public database for memory metadata.
// Media files are stored in Cloudinary.
export const SUPABASE_MEMORIES_SQL = `create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  public_id text not null,
  url text not null,
  secure_url text not null,
  resource_type text not null check (resource_type in ('image', 'video')),
  original_filename text,
  format text,
  bytes bigint,
  width integer,
  height integer,
  created_at timestamptz default now()
);

alter table memories enable row level security;

create policy "Anyone can view memories"
on memories for select
using (true);

create policy "Anyone can insert memories"
on memories for insert
with check (true);

create policy "Anyone can delete memories"
on memories for delete
using (true);`

// Run this migration in Supabase SQL Editor to store the visitor name
// (uploader) with each memory metadata row.
export const SUPABASE_MEMORIES_UPLOADER_NAME_SQL = `alter table memories
add column if not exists uploader_name text;`
