create table if not exists public.cpc_billing_state (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  provider text not null check (provider = 'stripe'),
  stripe_customer_id text not null,
  stripe_subscription_id text,
  stripe_price_id text,
  status text not null check (status in ('incomplete','incomplete_expired','trialing','active','past_due','canceled','unpaid','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, stripe_customer_id),
  unique (provider, stripe_subscription_id)
);

create index if not exists cpc_billing_state_client_idx on public.cpc_billing_state(client_id);
create index if not exists cpc_billing_state_status_idx on public.cpc_billing_state(status);

alter table public.cpc_billing_state enable row level security;

revoke all on table public.cpc_billing_state from anon, authenticated;

create policy cpc_billing_state_service_only
on public.cpc_billing_state
for all
to service_role
using (true)
with check (true);
