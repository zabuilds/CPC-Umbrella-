# CPC Next Construction Step

## Active checkpoint
The database foundation and typed data contract are in place on `cpc/construction`.

## Immediate dependency gate
Before API route construction, the repository must reconcile runtime dependencies used by the Supabase integration layer. The application currently has a minimal package manifest and therefore the Supabase SSR/client and environment-validation packages must be declared before build verification can be treated as meaningful.

## Required packages
- `@supabase/ssr`
- `@supabase/supabase-js`
- `@t3-oss/env-nextjs`
- `zod`

## Construction rule
Do not claim the API/server milestone complete until dependency installation, typecheck, build, and the relevant authorization tests have passed on the construction branch.

## Next action
Reconcile package manifest/lockfile, then run typecheck/build and proceed to authorization test coverage.
