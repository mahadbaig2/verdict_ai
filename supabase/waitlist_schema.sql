
-- Waitlist Table
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table waitlist enable row level security;

-- Allow anyone to insert (public waitlist)
create policy "Anyone can join waitlist"
  on waitlist for insert
  with check (true);

-- Only admins can view (if you had an admin role, but for now we'll just keep it secure)
-- For now, disable read access for anon to prevent scraping
create policy "No public read access"
  on waitlist for select
  using (false);
