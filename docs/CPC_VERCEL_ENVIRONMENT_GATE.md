# CPC Vercel Environment Gate

## Status
BLOCKED — configuration dependency only.

## Verified
- The CPC construction branch contains the expected Next.js build script.
- The application requires `NEXT_PUBLIC_SUPABASE_URL`.
- The application requires `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- These are client-visible configuration values and are not secrets.
- No secret values were added to source control.
- The current construction commit's Vercel check is failing.

## Required action
Configure the two existing CPC Supabase public environment variables in the existing CPC Vercel project's applicable deployment environments, then trigger a new deployment/build.

## Safety rules
- Do not create a second Vercel project.
- Do not invent environment-variable values.
- Do not commit environment values into the repository.
- Do not change Supabase credentials or rotate keys as part of this gate.
- Do not alter application code merely to hide a missing environment configuration.

## Release gate
The CPC construction branch should not be considered preview-ready until a fresh Vercel deployment completes successfully and the application build/typecheck are verified.
