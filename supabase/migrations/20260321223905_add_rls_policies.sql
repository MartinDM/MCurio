-- =========================
-- 1. Helper function
-- =========================
create or replace function public.get_my_museum_id()
returns uuid
language sql
stable
as $$
  select museum_id
  from public.profiles
  where id = auth.uid()
$$;


-- =========================
-- 2. Enable RLS
-- =========================
alter table public.museums enable row level security;
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.contacts enable row level security;
alter table public.exhibitions enable row level security;
alter table public.condition_reports enable row level security;


-- =========================
-- 3. Profiles policies
-- =========================
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
on public.profiles
for insert
with check (id = auth.uid());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());


-- =========================
-- 4. Museums policies
-- =========================
drop policy if exists "museums: read own" on public.museums;
create policy "museums: read own"
on public.museums
for select
using (id = public.get_my_museum_id());

drop policy if exists "museums: update own" on public.museums;
create policy "museums: update own"
on public.museums
for update
using (id = public.get_my_museum_id())
with check (id = public.get_my_museum_id());


-- =========================
-- 5. Generic museum-scoped tables
-- (items, contacts, exhibitions, condition_reports)
-- =========================

-- ITEMS
drop policy if exists "items: read" on public.items;
create policy "items: read"
on public.items
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "items: insert" on public.items;
create policy "items: insert"
on public.items
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "items: update" on public.items;
create policy "items: update"
on public.items
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "items: delete" on public.items;
create policy "items: delete"
on public.items
for delete
using (museum_id = public.get_my_museum_id());


-- CONTACTS
drop policy if exists "contacts: read" on public.contacts;
create policy "contacts: read"
on public.contacts
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "contacts: insert" on public.contacts;
create policy "contacts: insert"
on public.contacts
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "contacts: update" on public.contacts;
create policy "contacts: update"
on public.contacts
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "contacts: delete" on public.contacts;
create policy "contacts: delete"
on public.contacts
for delete
using (museum_id = public.get_my_museum_id());


-- EXHIBITIONS
drop policy if exists "exhibitions: read" on public.exhibitions;
create policy "exhibitions: read"
on public.exhibitions
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "exhibitions: insert" on public.exhibitions;
create policy "exhibitions: insert"
on public.exhibitions
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "exhibitions: update" on public.exhibitions;
create policy "exhibitions: update"
on public.exhibitions
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "exhibitions: delete" on public.exhibitions;
create policy "exhibitions: delete"
on public.exhibitions
for delete
using (museum_id = public.get_my_museum_id());


-- CONDITION REPORTS
drop policy if exists "condition_reports: read" on public.condition_reports;
create policy "condition_reports: read"
on public.condition_reports
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "condition_reports: insert" on public.condition_reports;
create policy "condition_reports: insert"
on public.condition_reports
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "condition_reports: update" on public.condition_reports;
create policy "condition_reports: update"
on public.condition_reports
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "condition_reports: delete" on public.condition_reports;
create policy "condition_reports: delete"
on public.condition_reports
for delete
using (museum_id = public.get_my_museum_id());


-- =========================
-- 6. Auto-create profile on signup
-- =========================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, museum_id)
  values (
    new.id,
    null -- you may want to assign later
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();