# CPC Server Authorization & Data-Access Verification

## Scope
Verification of the server-side Supabase integration, CPC role helper, repository/data-access layer, API authentication gates, and committed SQL authorization regression coverage on `cpc/construction`.

## Verified
- Server-side Supabase client uses the typed `Database` contract and the environment contract.
- The environment contract requires the public Supabase URL and publishable key and does not define or expose a server secret.
- `getCurrentUserContext()` authenticates through Supabase Auth and retrieves the matching profile and role.
- `requireRole()` enforces an allow-list of CPC application roles before returning the user context.
- CPC API route groups for clients, properties, inspections, inspection reports, issues, and vendors perform an authenticated-user check before repository access.
- CPC repository modules use the shared typed Supabase client rather than introducing a second persistence layer.
- Generated database types include the CPC core tables and application role/status types.
- Committed authorization SQL currently verifies that anonymous access is filtered from all CPC core tables.

## Important Finding
The execution ledger states that the canonical core-schema migration was recorded at `supabase/migrations/20260814000000_cpc_core_schema_and_rls_foundation.sql`, but that migration file is **not currently present in the `cpc/construction` repository tree**. The repository currently contains the SQL authorization test under `supabase/tests/` but no `supabase/migrations/` directory was returned.

This is treated as a reconciliation discrepancy, not as evidence that the live Supabase database is missing the schema. No live database mutation is authorized or claimed from this repository inspection alone.

## Authorization Coverage Gap
The committed SQL regression test covers anonymous denial but does not yet exercise authenticated owner/client/operations/inspector/vendor role scenarios. Those tests require controlled authenticated test identities and representative rows. They should be added only after the canonical migration/schema source is restored or otherwise verified and the test-fixture strategy is established.

## Decision
No application-code authorization changes were made in this pass. The existing API authentication gates and RLS-first architecture are preserved. The next safe action is to reconcile the missing canonical migration artifact and then expand executable role-based authorization tests against controlled fixtures.
