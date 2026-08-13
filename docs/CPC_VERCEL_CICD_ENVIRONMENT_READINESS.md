# CPC Vercel / CI-CD / Environment Readiness

## Objective
Prepare CPC for safe deployment across development, preview, and production without exposing secrets or coupling deployment to unavailable integrations.

## Environments
- Development: non-production credentials and test data.
- Preview: Vercel preview deployment, preview-specific variables, Stripe test mode.
- Production: production Vercel deployment, production Supabase/Stripe credentials, production webhook configuration.

## Server-only secrets
- Supabase service-role credential.
- Stripe secret key.
- Stripe webhook signing secret.
- n8n webhook/auth secrets.
- Other provider credentials.

Never place server-only values in client-exposed variables or source control.

## CI/CD gates
1. Deterministic dependency install.
2. Typecheck.
3. Lint where configured.
4. Unit/integration tests.
5. Security/secret scan.
6. Production build.
7. Migration validation for target environment.
8. Preview/browser verification for UI changes.
9. Production deployment only after required gates pass.

## Database deployment
Apply migrations deliberately to the target Supabase environment. Do not make destructive database changes an incidental frontend build step. Reconcile the existing schema before billing migrations.

## Stripe deployment
Inspect existing Products, Prices, Customers, and configuration first. Verify approved CPC pricing before creating Prices. Preview uses Stripe test mode. Production resources are created/modified only after end-to-end verification is ready.

## n8n deployment
n8n is a separate integration layer. A workflow is not considered deployed until the n8n environment is reachable and a real execution is verified.

## Rollback
Prefer additive/reversible database migrations. Preserve a deployable prior application version. Stripe changes require reconciliation rather than destructive recreation. If billing synchronization becomes unsafe, fail closed for entitlement changes rather than granting access from unverified state.

## Production readiness
- Correct Vercel project/environment identified.
- Preview and production variables separated.
- Server-only secrets protected.
- No credentials committed to GitHub.
- CI typecheck/tests/security scan/build pass.
- Database reconciled and RLS verified.
- Stripe test flow verified in preview.
- Production Stripe resources inspected/approved.
- Webhook signature verification tested.
- n8n reachable and workflows verified if used.
- Stripe → webhook → Supabase → entitlement flow passes.
- Monitoring and alerts operational.
- Rollback/recovery documented.

## Current status
This is an implementation-readiness package. Live Vercel deployment, production environment configuration, Stripe resource configuration, Supabase deployment, and n8n workflow deployment remain execution steps requiring their respective live access.