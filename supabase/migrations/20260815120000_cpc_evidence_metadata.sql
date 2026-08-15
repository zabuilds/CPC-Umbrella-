-- CPC Evidence Metadata
-- Construction specification only. Apply after review/verification.

create table if not exists public.evidence_metadata (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  issue_id uuid references public.issues(id) on delete set null,
  kind text not null check (kind in ('photo', 'video', 'document')),
  storage_path text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  captured_at timestamptz,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists evidence_metadata_client_id_idx
  on public.evidence_metadata(client_id);
create index if not exists evidence_metadata_property_id_idx
  on public.evidence_metadata(property_id);
create index if not exists evidence_metadata_inspection_id_idx
  on public.evidence_metadata(inspection_id);
create index if not exists evidence_metadata_issue_id_idx
  on public.evidence_metadata(issue_id);

alter table public.evidence_metadata enable row level security;

-- Authorization is intentionally derived through the existing client/property
-- relationship. This migration does not introduce a parallel ownership model.
create policy evidence_metadata_select_authorized
  on public.evidence_metadata
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.properties p
      where p.id = evidence_metadata.property_id
        and p.client_id = evidence_metadata.client_id
    )
  );

create policy evidence_metadata_insert_authorized
  on public.evidence_metadata
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.properties p
      join public.inspections i on i.property_id = p.id
      where p.id = evidence_metadata.property_id
        and p.client_id = evidence_metadata.client_id
        and i.id = evidence_metadata.inspection_id
    )
    and (
      evidence_metadata.issue_id is null
      or exists (
        select 1
        from public.issues x
        where x.id = evidence_metadata.issue_id
          and x.property_id = evidence_metadata.property_id
          and x.inspection_id = evidence_metadata.inspection_id
      )
    )
  );

create policy evidence_metadata_update_authorized
  on public.evidence_metadata
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.properties p
      where p.id = evidence_metadata.property_id
        and p.client_id = evidence_metadata.client_id
    )
  )
  with check (
    exists (
      select 1
      from public.properties p
      join public.inspections i on i.property_id = p.id
      where p.id = evidence_metadata.property_id
        and p.client_id = evidence_metadata.client_id
        and i.id = evidence_metadata.inspection_id
    )
    and (
      evidence_metadata.issue_id is null
      or exists (
        select 1
        from public.issues x
        where x.id = evidence_metadata.issue_id
          and x.property_id = evidence_metadata.property_id
          and x.inspection_id = evidence_metadata.inspection_id
      )
    )
  );

create policy evidence_metadata_delete_authorized
  on public.evidence_metadata
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.properties p
      where p.id = evidence_metadata.property_id
        and p.client_id = evidence_metadata.client_id
    )
  );
