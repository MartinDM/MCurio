-- museums first (no FK dependencies)
CREATE TABLE public.museums (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  description text,
  contact_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT museums_pkey PRIMARY KEY (id)
);

-- contacts depends on museums
CREATE TABLE public.contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  type text DEFAULT 'other'::text CHECK (type = ANY (ARRAY['academic'::text, 'private'::text, 'corporate'::text, 'other_museum'::text, 'staff_member'::text])),
  organization text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  museum_id uuid NOT NULL,
  CONSTRAINT contacts_pkey PRIMARY KEY (id),
  CONSTRAINT contacts_museum_id_fkey FOREIGN KEY (museum_id) REFERENCES public.museums(id)
);

-- now add the FK from museums to contacts (circular resolved after both tables exist)
ALTER TABLE public.museums
  ADD CONSTRAINT museums_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);

-- exhibitions depends on museums
CREATE TABLE public.exhibitions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date,
  end_date date,
  status text DEFAULT 'planned'::text CHECK (status = ANY (ARRAY['planned'::text, 'current'::text, 'past'::text])),
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  museum_id uuid NOT NULL,
  CONSTRAINT exhibitions_pkey PRIMARY KEY (id),
  CONSTRAINT exhibitions_museum_id_fkey FOREIGN KEY (museum_id) REFERENCES public.museums(id)
);

-- items depends on museums, contacts, exhibitions
CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  name text,
  artist text,
  medium text,
  year integer,
  description text,
  acquisition_date date,
  exhibition_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  contact_id uuid,
  contact_role text CHECK (contact_role = ANY (ARRAY['artist'::text, 'donor'::text, 'lender'::text, 'curator'::text])),
  museum_id uuid NOT NULL,
  CONSTRAINT items_pkey PRIMARY KEY (id),
  CONSTRAINT items_exhibition_id_fkey FOREIGN KEY (exhibition_id) REFERENCES public.exhibitions(id),
  CONSTRAINT items_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id),
  CONSTRAINT items_museum_fkey FOREIGN KEY (museum_id) REFERENCES public.museums(id)
);

-- condition_reports depends on items, contacts, museums
CREATE TABLE public.condition_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  contact_id uuid,
  date date NOT NULL,
  status text DEFAULT 'stable'::text CHECK (status = ANY (ARRAY['excellent'::text, 'stable'::text, 'needs_attention'::text])),
  notes text,
  temperature numeric,
  humidity numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  museum_id uuid NOT NULL,
  CONSTRAINT condition_reports_pkey PRIMARY KEY (id),
  CONSTRAINT condition_reports_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
  CONSTRAINT condition_reports_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id),
  CONSTRAINT condition_reports_museum_id_fkey FOREIGN KEY (museum_id) REFERENCES public.museums(id)
);
-- profiles.museum_id is nullable so new users can sign up before being assigned to a museum
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  museum_id uuid,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_museum_id_fkey FOREIGN KEY (museum_id) REFERENCES public.museums(id)
);