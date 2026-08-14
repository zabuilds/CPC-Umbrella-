-- CPC core schema + RLS foundation
-- Applied to the existing CPC Supabase project as migration: cpc_core_schema_and_rls_foundation
-- Keep this file synchronized with the canonical database migration history.

create schema if not exists private;

create type public.app_role as enum ('owner','admin','operations','inspector','vendor');
create type public.property_status as enum ('active','inactive','archived');
create type public.inspection_status as enum ('scheduled','in_progress','completed','cancelled');
create type public.issue_severity as enum ('urgent','attention','monitor');
create type public.issue_status as enum ('open','in_progress','resolved','dismissed');
create type public.vendor_status as enum ('active','inactive');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'owner',
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  legal_name text not null,
  display_name text,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  name text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text,
  postal_code text,
  island text not null default 'Grand Cayman',
  status public.property_status not null default 'active',
  access_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text,
  email text,
  phone text,
  trade text,
  status public.vendor_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  inspector_id uuid references public.profiles(id) on delete set null,
  scheduled_for timestamptz not null,
  started_at timestamptz,
  completed_at timestamptz,
  status public.inspection_status not null default 'scheduled',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (completed_at is null or started_at is not null),
  check (completed_at is null or completed_at >= coalesce(started_at, scheduled_for))
);

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  inspection_id uuid references public.inspections(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete set null,
  reported_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  severity public.issue_severity not null,
  status public.issue_status not null default 'open',
  due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (resolved_at is null or status in ('resolved','dismissed'))
);

create table public.inspection_reports (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null unique references public.inspections(id) on delete cascade,
  report_version integer not null default 1 check (report_version > 0),
  report_status text not null default 'draft' check (report_status in ('draft','final','delivered')),
  report_data jsonb not null default '{}'::jsonb,
  finalized_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_contacts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  contact_name text not null,
  contact_type text not null check (contact_type in ('owner','manager','emergency','vendor','other')),
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_client_id_idx on public.properties(client_id);
create index inspections_property_scheduled_idx on public.inspections(property_id, scheduled_for desc);
create index inspections_inspector_scheduled_idx on public.inspections(inspector_id, scheduled_for desc);
create index issues_property_status_idx on public.issues(property_id, status);
create index issues_severity_status_idx on public.issues(severity, status);
create index issues_vendor_id_idx on public.issues(vendor_id);
create index property_contacts_property_id_idx on public.property_contacts(property_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','clients','properties','vendors','inspections','issues','inspection_reports','property_contacts'] loop
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

create or replace function private.current_app_role()
returns public.app_role
language sql
stable
security invoker
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid()) limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.properties enable row level security;
alter table public.vendors enable row level security;
alter table public.inspections enable row level security;
alter table public.issues enable row level security;
alter table public.inspection_reports enable row level security;
alter table public.property_contacts enable row level security;

-- Policies intentionally mirror the approved client/property/operations boundaries.
-- Production policy expansion should remain migration-based and be verified with RLS tests.

create policy profiles_self_select on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'));
create policy profiles_self_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy clients_owner_access on public.clients for all to authenticated using (profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations')) with check (profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'));
create policy properties_client_access on public.properties for all to authenticated using (exists (select 1 from public.clients c where c.id = client_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations')))) with check (exists (select 1 from public.clients c where c.id = client_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'))));
create policy vendors_internal_access on public.vendors for all to authenticated using ((select private.current_app_role()) in ('admin','operations','inspector')) with check ((select private.current_app_role()) in ('admin','operations','inspector'));
create policy inspections_property_access on public.inspections for all to authenticated using ((inspector_id = (select auth.uid())) or exists (select 1 from public.properties p join public.clients c on c.id = p.client_id where p.id = property_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations')))) with check ((inspector_id = (select auth.uid())) or exists (select 1 from public.properties p join public.clients c on c.id = p.client_id where p.id = property_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'))));
create policy issues_property_access on public.issues for all to authenticated using ((reported_by = (select auth.uid())) or exists (select 1 from public.properties p join public.clients c on c.id = p.client_id where p.id = property_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations')))) with check ((reported_by = (select auth.uid())) or exists (select 1 from public.properties p join public.clients c on c.id = p.client_id where p.id = property_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'))));
create policy reports_property_access on public.inspection_reports for all to authenticated using (exists (select 1 from public.inspections i join public.properties p on p.id = i.property_id join public.clients c on c.id = p.client_id where i.id = inspection_id and (c.profile_id = (select auth.uid()) or i.inspector_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations')))) with check (exists (select 1 from public.inspections i join public.properties p on p.id = i.property_id join public.clients c on c.id = p.client_id where i.id = inspection_id and (c.profile_id = (select auth.uid()) or i.inspector_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'))));
create policy property_contacts_access on public.property_contacts for all to authenticated using (exists (select 1 from public.properties p join public.clients c on c.id = p.client_id where p.id = property_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations')))) with check (exists (select 1 from public.properties p join public.clients c on c.id = p.client_id where p.id = property_id and (c.profile_id = (select auth.uid()) or (select private.current_app_role()) in ('admin','operations'))));

revoke all on public.profiles, public.clients, public.properties, public.vendors, public.inspections, public.issues, public.inspection_reports, public.property_contacts from anon;
grant select, insert, update on public.profiles, public.clients, public.properties, public.vendors, public.inspections, public.issues, public.inspection_reports, public.property_contacts to authenticated;
