alter table public.items
  add column if not exists item_type text not null default 'art_piece',
  add column if not exists tags text[] default '{}'::text[],
  add column if not exists current_location text,
  add column if not exists label_text text,
  add column if not exists maker_origin text,
  add column if not exists period_provenance text,
  add column if not exists date_notes text,
  add column if not exists acquisition_type text,
  add column if not exists acquisition_source text,
  add column if not exists acquisition_value numeric;

alter table public.items
  drop constraint if exists items_item_type_check;
alter table public.items
  add constraint items_item_type_check
  check (item_type = any (array['art_piece'::text, 'object'::text, 'photograph'::text, 'document'::text]));

alter table public.items
  drop constraint if exists items_acquisition_type_check;
alter table public.items
  add constraint items_acquisition_type_check
  check (
    acquisition_type is null
    or acquisition_type = any (array['purchase'::text, 'gift'::text, 'loan'::text])
  );

create table if not exists public.loans (
  id uuid not null default gen_random_uuid(),
  reference_code text,
  contact_id uuid not null,
  loan_type text not null default 'outgoing',
  status text not null default 'draft',
  start_date date,
  end_date date,
  notes text,
  museum_id uuid not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint loans_pkey primary key (id),
  constraint loans_contact_id_fkey foreign key (contact_id) references public.contacts(id),
  constraint loans_museum_id_fkey foreign key (museum_id) references public.museums(id),
  constraint loans_loan_type_check check (loan_type = any (array['incoming'::text, 'outgoing'::text])),
  constraint loans_status_check check (status = any (array['draft'::text, 'active'::text, 'returned'::text, 'cancelled'::text]))
);

create table if not exists public.loan_items (
  loan_id uuid not null,
  item_id uuid not null,
  museum_id uuid not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint loan_items_pkey primary key (loan_id, item_id),
  constraint loan_items_loan_id_fkey foreign key (loan_id) references public.loans(id) on delete cascade,
  constraint loan_items_item_id_fkey foreign key (item_id) references public.items(id),
  constraint loan_items_museum_id_fkey foreign key (museum_id) references public.museums(id)
);

create table if not exists public.properties (
  id uuid not null default gen_random_uuid(),
  name text not null,
  type text not null,
  required boolean not null default false,
  sort_order integer not null default 0,
  museum_id uuid not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint properties_pkey primary key (id),
  constraint properties_museum_id_fkey foreign key (museum_id) references public.museums(id),
  constraint properties_type_check check (type = any (array['text'::text, 'place'::text, 'number'::text, 'boolean'::text])),
  constraint properties_unique_name_per_museum unique (museum_id, name)
);

create table if not exists public.item_property_values (
  id uuid not null default gen_random_uuid(),
  item_id uuid not null,
  property_id uuid not null,
  value_text text,
  value_number numeric,
  value_boolean boolean,
  museum_id uuid not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint item_property_values_pkey primary key (id),
  constraint item_property_values_item_id_fkey foreign key (item_id) references public.items(id) on delete cascade,
  constraint item_property_values_property_id_fkey foreign key (property_id) references public.properties(id) on delete cascade,
  constraint item_property_values_museum_id_fkey foreign key (museum_id) references public.museums(id),
  constraint item_property_values_unique_per_item_property unique (item_id, property_id),
  constraint item_property_values_single_value_check check (num_nonnulls(value_text, value_number, value_boolean) = 1)
);

create or replace function public.validate_item_property_value_type()
returns trigger
language plpgsql
as $$
declare
  property_type text;
begin
  select type into property_type
  from public.properties
  where id = new.property_id;

  if property_type is null then
    raise exception 'Property % does not exist', new.property_id;
  end if;

  if property_type in ('text', 'place') and new.value_text is null then
    raise exception 'Property type % requires value_text', property_type;
  end if;

  if property_type = 'number' and new.value_number is null then
    raise exception 'Property type number requires value_number';
  end if;

  if property_type = 'boolean' and new.value_boolean is null then
    raise exception 'Property type boolean requires value_boolean';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_item_property_value_type on public.item_property_values;
create trigger trg_validate_item_property_value_type
before insert or update on public.item_property_values
for each row
execute function public.validate_item_property_value_type();

alter table public.loans enable row level security;
alter table public.loan_items enable row level security;
alter table public.properties enable row level security;
alter table public.item_property_values enable row level security;

drop policy if exists "loans: read" on public.loans;
create policy "loans: read"
on public.loans
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "loans: insert" on public.loans;
create policy "loans: insert"
on public.loans
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "loans: update" on public.loans;
create policy "loans: update"
on public.loans
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "loans: delete" on public.loans;
create policy "loans: delete"
on public.loans
for delete
using (museum_id = public.get_my_museum_id());

drop policy if exists "loan_items: read" on public.loan_items;
create policy "loan_items: read"
on public.loan_items
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "loan_items: insert" on public.loan_items;
create policy "loan_items: insert"
on public.loan_items
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "loan_items: update" on public.loan_items;
create policy "loan_items: update"
on public.loan_items
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "loan_items: delete" on public.loan_items;
create policy "loan_items: delete"
on public.loan_items
for delete
using (museum_id = public.get_my_museum_id());

drop policy if exists "properties: read" on public.properties;
create policy "properties: read"
on public.properties
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "properties: insert" on public.properties;
create policy "properties: insert"
on public.properties
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "properties: update" on public.properties;
create policy "properties: update"
on public.properties
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "properties: delete" on public.properties;
create policy "properties: delete"
on public.properties
for delete
using (museum_id = public.get_my_museum_id());

drop policy if exists "item_property_values: read" on public.item_property_values;
create policy "item_property_values: read"
on public.item_property_values
for select
using (museum_id = public.get_my_museum_id());

drop policy if exists "item_property_values: insert" on public.item_property_values;
create policy "item_property_values: insert"
on public.item_property_values
for insert
with check (museum_id = public.get_my_museum_id());

drop policy if exists "item_property_values: update" on public.item_property_values;
create policy "item_property_values: update"
on public.item_property_values
for update
using (museum_id = public.get_my_museum_id())
with check (museum_id = public.get_my_museum_id());

drop policy if exists "item_property_values: delete" on public.item_property_values;
create policy "item_property_values: delete"
on public.item_property_values
for delete
using (museum_id = public.get_my_museum_id());
