create table public.user_menu_pins (
  user_id uuid not null,
  resource_name text not null,
  position integer not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_menu_pins_pkey primary key (user_id, resource_name),
  constraint user_menu_pins_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade,
  constraint user_menu_pins_position_check check (position >= 0)
);

alter table public.user_menu_pins enable row level security;

drop policy if exists "user_menu_pins: read own" on public.user_menu_pins;
create policy "user_menu_pins: read own"
on public.user_menu_pins
for select
using (user_id = auth.uid());

drop policy if exists "user_menu_pins: insert own" on public.user_menu_pins;
create policy "user_menu_pins: insert own"
on public.user_menu_pins
for insert
with check (user_id = auth.uid());

drop policy if exists "user_menu_pins: update own" on public.user_menu_pins;
create policy "user_menu_pins: update own"
on public.user_menu_pins
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "user_menu_pins: delete own" on public.user_menu_pins;
create policy "user_menu_pins: delete own"
on public.user_menu_pins
for delete
using (user_id = auth.uid());
