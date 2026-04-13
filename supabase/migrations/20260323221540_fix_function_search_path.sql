create or replace function public.get_my_museum_id()
returns uuid
language sql
stable
set search_path = public
as $$
  select museum_id
  from public.profiles
  where id = auth.uid()
$$;