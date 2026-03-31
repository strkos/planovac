begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;
comment on schema app_private is 'Interni schema pro provozni konfiguraci a metadata preview prostredi.';
revoke all on schema app_private from public;

create type public.user_role as enum ('admin', 'clen');
create type public.user_status as enum ('active', 'inactive');
create type public.task_kind as enum ('role', 'work');
create type public.assignment_type as enum ('main', 'substitute');
create type public.assignment_status as enum ('pending', 'confirmed', 'rejected');
create type public.feature_request_status as enum (
  'proposed',
  'implementing',
  'preview_ready',
  'testing',
  'voting',
  'approved',
  'rejected',
  'deployed'
);
create type public.preview_schema_status as enum (
  'active',
  'cleanup_pending',
  'cleaned',
  'expired'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.app_users (
  id uuid primary key default extensions.gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  role public.user_role not null default 'clen',
  status public.user_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.app_users is 'Kanonicka evidence Uzivatelu aplikace mimo auth vrstvu.';

create table public.events (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text not null,
  description text,
  event_type text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint events_end_after_start check (ends_at is null or ends_at > starts_at)
);

comment on table public.events is 'Akce planovane spolkem.';

create table public.tasks (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  title text not null,
  description text,
  kind public.task_kind not null,
  required_count integer not null default 1,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint tasks_required_count_positive check (required_count > 0)
);

comment on table public.tasks is 'Ukoly a role navazane na Akce.';

create table public.task_assignments (
  id uuid primary key default extensions.gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete restrict,
  created_by_user_id uuid references public.app_users(id) on delete set null,
  assignment_type public.assignment_type not null default 'main',
  status public.assignment_status not null default 'pending',
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint task_assignments_unique_user_per_task unique (task_id, user_id)
);

comment on table public.task_assignments is 'Prihlaseni Uzivatelu na Ukoly vcetne nahradniku a potvrzeni.';

create table public.feature_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  description text not null,
  created_by_user_id uuid references public.app_users(id) on delete set null,
  status public.feature_request_status not null default 'proposed',
  preview_branch_ref text,
  preview_schema_name text,
  preview_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.feature_requests is 'Minimalni evidence feature requestu a jejich preview stavu.';

create table app_private.preview_contact_identity_map (
  production_user_id uuid primary key references public.app_users(id) on delete cascade,
  preview_full_name text not null,
  preview_email text not null unique,
  preview_phone text,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table app_private.preview_contact_identity_map is 'Stabilni mapovani vybranych Uzivatelu na neprodukcni kontaktni udaje pro preview snapshoty.';

create table app_private.preview_schema_registry (
  schema_name text primary key,
  source_identifier text not null,
  source_number integer,
  source_branch_ref text,
  cleanup_status public.preview_schema_status not null default 'active',
  snapshot_taken_at timestamptz,
  expires_at timestamptz not null default timezone('utc', now()) + interval '7 days',
  created_at timestamptz not null default timezone('utc', now()),
  cleaned_at timestamptz,
  cleanup_reason text,
  constraint preview_schema_registry_name_format check (schema_name ~ '^[a-z][a-z0-9_]+$')
);

comment on table app_private.preview_schema_registry is 'Evidence preview schemat kvuli cleanupu a expirani.';

create index events_starts_at_idx on public.events (starts_at);
create index tasks_event_id_idx on public.tasks (event_id);
create index task_assignments_task_id_idx on public.task_assignments (task_id);
create index task_assignments_user_id_idx on public.task_assignments (user_id);
create index feature_requests_status_idx on public.feature_requests (status);
create index preview_schema_registry_cleanup_status_idx
  on app_private.preview_schema_registry (cleanup_status, expires_at);

create trigger set_app_users_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger set_task_assignments_updated_at
before update on public.task_assignments
for each row execute function public.set_updated_at();

create trigger set_feature_requests_updated_at
before update on public.feature_requests
for each row execute function public.set_updated_at();

create trigger set_preview_contact_identity_map_updated_at
before update on app_private.preview_contact_identity_map
for each row execute function public.set_updated_at();

alter table public.app_users enable row level security;
alter table public.events enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignments enable row level security;
alter table public.feature_requests enable row level security;
alter table app_private.preview_contact_identity_map enable row level security;
alter table app_private.preview_schema_registry enable row level security;

commit;
