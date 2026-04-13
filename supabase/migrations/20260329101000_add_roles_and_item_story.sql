create table if not exists public.roles (
  id uuid not null default gen_random_uuid(),
  museum_id uuid not null,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint roles_pkey primary key (id),
  constraint roles_museum_id_fkey foreign key (museum_id) references public.museums(id) on delete cascade,
  constraint roles_unique_name_per_museum unique (museum_id, name),
  constraint roles_name_not_blank check (length(trim(name)) > 0),
  constraint roles_id_museum_unique unique (id, museum_id)
);

alter table public.profiles
  add column if not exists role_id uuid;

alter table public.profiles
  drop constraint if exists profiles_role_museum_fkey;

alter table public.profiles
  add constraint profiles_role_museum_fkey
  foreign key (role_id, museum_id)
  references public.roles(id, museum_id)
  on update cascade
  on delete set null;

create index if not exists idx_profiles_role_id on public.profiles(role_id);
create index if not exists idx_roles_museum_id on public.roles(museum_id);

create or replace function public.create_default_roles_for_museum()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.roles (museum_id, name)
  values (new.id, 'Admin')
  on conflict (museum_id, name) do nothing;

  insert into public.roles (museum_id, name)
  values (new.id, 'Member')
  on conflict (museum_id, name) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_create_default_roles_for_museum on public.museums;
create trigger trg_create_default_roles_for_museum
after insert on public.museums
for each row
execute function public.create_default_roles_for_museum();

insert into public.roles (museum_id, name)
select m.id, 'Admin'
from public.museums m
on conflict (museum_id, name) do nothing;

insert into public.roles (museum_id, name)
select m.id, 'Member'
from public.museums m
on conflict (museum_id, name) do nothing;

update public.profiles p
set role_id = r.id
from public.roles r
where p.museum_id is not null
  and p.role_id is null
  and r.museum_id = p.museum_id
  and lower(r.name) = case when p.is_admin then 'admin' else 'member' end;

create or replace function public.is_my_museum_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    left join public.roles r
      on r.id = p.role_id
      and r.museum_id = p.museum_id
    where p.id = auth.uid()
      and (
        p.is_admin = true
        or lower(coalesce(r.name, '')) = 'admin'
      )
  )
$$;

alter table public.roles enable row level security;

drop policy if exists "roles: read" on public.roles;
create policy "roles: read"
on public.roles
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "roles: insert" on public.roles;
create policy "roles: insert"
on public.roles
for insert
with check (
  museum_id = public.get_my_museum_id()
  and public.is_my_museum_admin()
);

drop policy if exists "roles: update" on public.roles;
create policy "roles: update"
on public.roles
for update
using (
  museum_id = public.get_my_museum_id()
  and public.is_my_museum_admin()
)
with check (
  museum_id = public.get_my_museum_id()
  and public.is_my_museum_admin()
);

drop policy if exists "roles: delete" on public.roles;
create policy "roles: delete"
on public.roles
for delete
using (
  museum_id = public.get_my_museum_id()
  and public.is_my_museum_admin()
);

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
on public.profiles
for select
using (
  id = auth.uid()
  or (
    public.is_my_museum_admin()
    and museum_id = public.get_my_museum_id()
  )
);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
on public.profiles
for insert
with check (
  id = auth.uid()
  or (
    public.is_my_museum_admin()
    and museum_id = public.get_my_museum_id()
  )
);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
on public.profiles
for update
using (
  id = auth.uid()
  or (
    public.is_my_museum_admin()
    and museum_id = public.get_my_museum_id()
  )
)
with check (
  id = auth.uid()
  or (
    public.is_my_museum_admin()
    and museum_id = public.get_my_museum_id()
  )
);

alter table public.items
  add column if not exists story_content text;
