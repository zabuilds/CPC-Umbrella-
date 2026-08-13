# CPC Database Migration & Security Sequence

## Purpose
Define the safe execution order for CPC's Supabase/Postgres implementation without duplicating existing resources.

## Preflight
1. Inspect the existing CPC-Umbrella- database schema and migrations.
2. Confirm existing client/property/service identifiers and relationships.
3. Reconcile any existing billing tables before creating anything.
4. Verify target environment (development/preview/production).
5. Verify approved CPC pricing exists before creating Stripe Price records.
6. Back up or otherwise establish rollback capability before destructive changes.

## Migration order
1. Extensions and shared database primitives.
2. Core CPC domain tables/relationships that billing depends on.
3. `service_plans`.
4. `billing_customers`.
5. `billing_subscriptions`.
6. `billing_entitlements`.
7. `billing_events`.
8. `billing_transactions`.
9. Foreign keys, uniqueness constraints, checks, and indexes.
10. Timestamp/update mechanisms where used by the established CPC architecture.
11. RLS enablement.
12. Staff/internal policies according to the existing CPC authorization matrix.
13. Client read policies scoped through authenticated identity.
14. Server-only billing mutation boundaries.
15. Webhook/event audit protections.
16. Verification queries and security tests.

## Required constraints
- `service_plans.code` unique.
- Stripe Product ID unique when populated.
- Stripe Price ID unique when populated.
- One billing customer mapping per CPC client.
- One CPC mapping per Stripe Customer ID.
- Stripe Subscription ID unique.
- Stripe Event ID unique and used as the idempotency key.
- Monetary amounts non-negative.
- Currency values constrained to expected three-letter format.
- Billing state values constrained to the approved lifecycle model.

## RLS principles
- Enable RLS on every billing table.
- Browser clients never receive unrestricted billing-table mutation privileges.
- A client can read only billing records belonging to that authenticated client.
- Entitlements are read-only from the client perspective.
- Billing events are server-side audit/idempotency records.
- Stripe synchronization writes occur only through trusted server-side paths.
- Staff/admin access follows the authoritative CPC role matrix; do not invent broader access.
- Vendor users receive no billing access unless explicitly authorized by the existing CPC architecture.

## Verification sequence
After migration:
1. Confirm all tables exist exactly once.
2. Confirm all expected constraints/indexes exist.
3. Confirm RLS is enabled.
4. Confirm anonymous access is denied.
5. Confirm Client A cannot read Client B billing records.
6. Confirm clients cannot mutate subscriptions or entitlements directly.
7. Confirm server-side billing paths can perform required writes.
8. Confirm duplicate Stripe event IDs are rejected/no-op safely.
9. Confirm unknown Stripe Product/Price mappings fail safely.
10. Run schema/type generation and application integration tests.

## Rollback principle
Prefer additive, reversible migrations. Do not drop existing CPC data or constraints without explicit reconciliation evidence and a documented rollback plan. Database changes must remain compatible with the application during deployment.

## Stripe sequencing
Supabase schema readiness does not authorize Stripe resource creation. Stripe Products/Prices are created only after existing Stripe resources are inspected and approved CPC pricing is verified. Stripe remains payment authority; Supabase stores synchronized application state.
