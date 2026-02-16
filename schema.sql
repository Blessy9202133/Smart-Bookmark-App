-- Create a table for bookmarks
create table bookmarks (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks" on bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks" on bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks" on bookmarks
  for delete using (auth.uid() = user_id);

-- Create a realtime publication if not already present (optional, sometimes enabled by default)
-- You need to enable replication for this table in the Dashboard: 
-- Database -> Replication -> Source -> select 'bookmarks'
