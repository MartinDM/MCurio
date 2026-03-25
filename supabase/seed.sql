-- Dummy data seed for local development
-- Runs automatically on `supabase db reset` because config.toml includes ./seed.sql

-- -----------------------------
-- Museums
-- -----------------------------
INSERT INTO public.museums (id, name, address, description)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'MCurio Demo Museum',
    '1 Curator Lane, Demo City',
    'Primary demo museum used for local development.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Partner Gallery',
    '22 Exhibition Ave, Demo City',
    'Secondary museum to test museum-level data isolation.'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------
-- Contacts
-- -----------------------------
INSERT INTO public.contacts (
  id,
  museum_id,
  name,
  email,
  phone,
  type,
  organization,
  notes
)
VALUES
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'Elena Rossi',
    'elena.rossi@example.com',
    '+1-555-0101',
    'staff_member',
    'MCurio Demo Museum',
    'Head Conservator'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111',
    'Noah Patel',
    'noah.patel@example.com',
    '+1-555-0102',
    'academic',
    'City University',
    'Research collaborator for textile artifacts'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '22222222-2222-4222-8222-222222222222',
    'Mia Laurent',
    'mia.laurent@example.com',
    '+1-555-0103',
    'private',
    'Independent Collector',
    'Lending contact for partner gallery'
  )
ON CONFLICT (id) DO NOTHING;

-- set a primary contact per museum
UPDATE public.museums
SET contact_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
WHERE id = '11111111-1111-4111-8111-111111111111';

UPDATE public.museums
SET contact_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3'
WHERE id = '22222222-2222-4222-8222-222222222222';

-- -----------------------------
-- Exhibitions
-- -----------------------------
INSERT INTO public.exhibitions (
  id,
  museum_id,
  name,
  start_date,
  end_date,
  status,
  description
)
VALUES
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '11111111-1111-4111-8111-111111111111',
    'Threads of Time',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '60 days',
    'current',
    'Explores textile history and restoration techniques.'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '11111111-1111-4111-8111-111111111111',
    'Bronze Through Ages',
    CURRENT_DATE + INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '120 days',
    'planned',
    'Upcoming exhibition on bronze artifacts.'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    '22222222-2222-4222-8222-222222222222',
    'Private Collection Highlights',
    CURRENT_DATE - INTERVAL '90 days',
    CURRENT_DATE - INTERVAL '30 days',
    'past',
    'Highlights from private collections.'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------
-- Items
-- -----------------------------
INSERT INTO public.items (
  id,
  museum_id,
  title,
  name,
  artist,
  medium,
  year,
  description,
  acquisition_date,
  exhibition_id,
  contact_id,
  contact_role
)
VALUES
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
    '11111111-1111-4111-8111-111111111111',
    'Silk Banner Fragment',
    'Banner Fragment A',
    'Unknown',
    'Silk and natural dye',
    1780,
    'Fragment stabilized after edge fraying treatment.',
    CURRENT_DATE - INTERVAL '365 days',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'curator'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
    '11111111-1111-4111-8111-111111111111',
    'Ceremonial Textile',
    'Textile Panel B',
    'Workshop of L. Herrera',
    'Cotton, embroidery thread',
    1850,
    'Color fading monitored quarterly.',
    CURRENT_DATE - INTERVAL '220 days',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'artist'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '11111111-1111-4111-8111-111111111111',
    'Bronze Vessel',
    'Ritual Vessel C',
    'Unknown',
    'Cast bronze',
    1620,
    'Surface oxidation documented before upcoming exhibit.',
    CURRENT_DATE - INTERVAL '140 days',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'curator'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc4',
    '22222222-2222-4222-8222-222222222222',
    'Landscape Sketch',
    'Sketch D',
    'M. Laurent',
    'Graphite on paper',
    1910,
    'Stored in flat archival box.',
    CURRENT_DATE - INTERVAL '400 days',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'lender'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------
-- Condition reports
-- -----------------------------
INSERT INTO public.condition_reports (
  id,
  museum_id,
  item_id,
  contact_id,
  date,
  status,
  notes,
  temperature,
  humidity
)
VALUES
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
    '11111111-1111-4111-8111-111111111111',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    CURRENT_DATE - INTERVAL '14 days',
    'stable',
    'No new tearing; frame support remains secure.',
    21.5,
    48.0
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd2',
    '11111111-1111-4111-8111-111111111111',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    CURRENT_DATE - INTERVAL '10 days',
    'needs_attention',
    'Minor pigment lift at top-right corner.',
    22.0,
    52.0
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd3',
    '11111111-1111-4111-8111-111111111111',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    CURRENT_DATE - INTERVAL '5 days',
    'excellent',
    'Surface cleaned; no active corrosion observed.',
    20.5,
    45.5
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
    '22222222-2222-4222-8222-222222222222',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc4',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    CURRENT_DATE - INTERVAL '7 days',
    'stable',
    'Paper fibers stable; no new foxing spots.',
    21.0,
    47.0
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------
-- Profile assignment helper (local dev convenience)
-- -----------------------------
-- Assign unassigned users to the primary demo museum so they can access data immediately.
UPDATE public.profiles
SET museum_id = '11111111-1111-4111-8111-111111111111'
WHERE museum_id IS NULL;
