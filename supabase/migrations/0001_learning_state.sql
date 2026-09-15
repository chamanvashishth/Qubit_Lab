create table if not exists public.learning_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  adaptive jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_state enable row level security;

drop policy if exists "Users can read their own learning state" on public.learning_state;
create policy "Users can read their own learning state"
  on public.learning_state for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own learning state" on public.learning_state;
create policy "Users can insert their own learning state"
  on public.learning_state for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own learning state" on public.learning_state;
create policy "Users can update their own learning state"
  on public.learning_state for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.learning_state to authenticated;
