set search_path = public;

insert into public.app_users (
  id,
  full_name,
  email,
  phone,
  role,
  status
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Jana Novakova',
    'jana.novakova@example.test',
    '+420777100100',
    'admin',
    'active'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Petr Svoboda',
    'petr.svoboda@example.test',
    '+420777100200',
    'clen',
    'active'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Eva Cerna',
    'eva.cerna@example.test',
    '+420777100300',
    'clen',
    'active'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Martin Dvorak',
    'martin.dvorak@example.test',
    '+420777100400',
    'clen',
    'inactive'
  )
on conflict (email) do update
set
  full_name = excluded.full_name,
  phone = excluded.phone,
  role = excluded.role,
  status = excluded.status,
  updated_at = timezone('utc', now());

insert into public.events (
  id,
  title,
  starts_at,
  ends_at,
  venue,
  description,
  event_type
)
values
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Sobotni trenink na hristi',
    timezone('utc', now()) + interval '10 day',
    timezone('utc', now()) + interval '10 day' + interval '3 hour',
    'Areal spolku',
    'Modelova akce pro overeni seznamu akci, ukolu a prirazeni.',
    'trenink'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Jarni brigada kolem klubovny',
    timezone('utc', now()) + interval '17 day',
    timezone('utc', now()) + interval '17 day' + interval '6 hour',
    'Klubovna a okoli',
    'Ukazkova brigada s kombinaci hlavni role a nahradniku.',
    'brigada'
  )
on conflict (id) do update
set
  title = excluded.title,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  venue = excluded.venue,
  description = excluded.description,
  event_type = excluded.event_type,
  updated_at = timezone('utc', now());

insert into public.tasks (
  id,
  event_id,
  title,
  description,
  kind,
  required_count,
  sort_order
)
values
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Rozhodci',
    'Dva clenove, kteri povedou trenink na hristi.',
    'role',
    2,
    10
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Priprava pomucek',
    'Priprava kuzelu, branek a lekarnicky.',
    'work',
    1,
    20
  ),
  (
    '12121212-1212-1212-1212-121212121212',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Uklid listi',
    'Prace kolem arealu pred sezonou.',
    'work',
    3,
    10
  ),
  (
    '13131313-1313-1313-1313-131313131313',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Odvoz materialu',
    'Ridic a pomocnik pro odvoz odpadu.',
    'role',
    2,
    20
  )
on conflict (id) do update
set
  event_id = excluded.event_id,
  title = excluded.title,
  description = excluded.description,
  kind = excluded.kind,
  required_count = excluded.required_count,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

insert into public.task_assignments (
  id,
  task_id,
  user_id,
  created_by_user_id,
  assignment_type,
  status
)
values
  (
    '14141414-1414-1414-1414-141414141414',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'main',
    'confirmed'
  ),
  (
    '15151515-1515-1515-1515-151515151515',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'main',
    'pending'
  ),
  (
    '16161616-1616-1616-1616-161616161616',
    '12121212-1212-1212-1212-121212121212',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'substitute',
    'confirmed'
  )
on conflict (id) do update
set
  task_id = excluded.task_id,
  user_id = excluded.user_id,
  created_by_user_id = excluded.created_by_user_id,
  assignment_type = excluded.assignment_type,
  status = excluded.status,
  updated_at = timezone('utc', now());

insert into public.feature_requests (
  id,
  title,
  description,
  created_by_user_id,
  status,
  preview_branch_ref,
  preview_schema_name,
  preview_url
)
values
  (
    '17171717-1717-1717-1717-171717171717',
    'Prehled preview verzi u feature requestu',
    'Clen chce u navrhu funkce videt odkaz na preview a aktualni stav testovani.',
    '11111111-1111-1111-1111-111111111111',
    'preview_ready',
    'cursor/cast-f0-04-58a7',
    'preview_104',
    'https://preview-104.example.test'
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  created_by_user_id = excluded.created_by_user_id,
  status = excluded.status,
  preview_branch_ref = excluded.preview_branch_ref,
  preview_schema_name = excluded.preview_schema_name,
  preview_url = excluded.preview_url,
  updated_at = timezone('utc', now());

insert into app_private.preview_contact_identity_map (
  production_user_id,
  preview_full_name,
  preview_email,
  preview_phone,
  note
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Testovaci Admin',
    'admin.preview@example.test',
    '+420700000101',
    'Stabilni identita pro smoke a provozni overeni.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Testovaci Clen',
    'clen.preview@example.test',
    '+420700000102',
    'Stabilni identita pro overeni prirazeni a notifikaci.'
  )
on conflict (production_user_id) do update
set
  preview_full_name = excluded.preview_full_name,
  preview_email = excluded.preview_email,
  preview_phone = excluded.preview_phone,
  note = excluded.note,
  updated_at = timezone('utc', now());

insert into app_private.preview_schema_registry (
  schema_name,
  source_identifier,
  source_number,
  source_branch_ref,
  cleanup_status,
  snapshot_taken_at,
  expires_at
)
values
  (
    'preview_104',
    'pr',
    104,
    'cursor/cast-f0-04-58a7',
    'active',
    timezone('utc', now()),
    timezone('utc', now()) + interval '7 days'
  )
on conflict (schema_name) do update
set
  source_identifier = excluded.source_identifier,
  source_number = excluded.source_number,
  source_branch_ref = excluded.source_branch_ref,
  cleanup_status = excluded.cleanup_status,
  snapshot_taken_at = excluded.snapshot_taken_at,
  expires_at = excluded.expires_at;
