# CPC Construction Blockers & Reconciliation

## Current blockers

1. **Vercel environment configuration**
   - The latest construction deployment fails during `next build` because `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are not configured in the Vercel project environment.
   - No secrets were created, exposed, or committed.
   - The application environment contract is intentionally strict and should remain strict.
   - Resolution requires configuring the existing CPC Vercel project with the already-authorized Supabase public URL and publishable key through the project environment settings.

2. **Canonical migration artifact**
   - The authoritative migration was recovered from the historical CPC database-fix commit and verified to contain the schema/RLS foundation previously applied to the existing CPC Supabase project.
   - The same migration is not currently present in the `cpc/construction` tree.
   - It has not been recreated blindly or applied to the live database during this checkpoint.
   - Repository reconciliation remains required before extending schema-dependent construction.

3. **Authenticated RLS fixtures**
   - Existing committed SQL verifies anonymous denial.
   - Authenticated owner/client/operations/inspector/vendor regression scenarios still require controlled test identities and fixtures.
   - Do not fabricate identities or claim those tests pass until the fixture strategy is executable.

## Safe next sequence

1. Restore the authoritative migration artifact onto `cpc/construction` without touching the live database.
2. Configure the existing CPC Vercel project environment with the authorized Supabase public variables.
3. Re-run build/typecheck verification.
4. Add controlled authenticated RLS regression coverage.
5. Re-check API/server foundation.
6. Only then continue into billing/integration construction.

## Safety

- No second Supabase project.
- No destructive branch operations.
- No force updates.
- No secrets in source control.
- No live database mutation claimed from repository inspection.
