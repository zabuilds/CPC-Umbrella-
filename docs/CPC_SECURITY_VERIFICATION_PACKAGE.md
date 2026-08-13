# CPC Security Verification Package

## Objective
Verify that CPC billing, client data, application access, and integrations cannot be manipulated across trust boundaries.

## Identity and authorization tests
- Unauthenticated protected billing requests return 401.
- Client A cannot read or modify Client B billing records.
- Clients cannot directly mutate subscriptions or entitlements.
- Vendor access follows the established CPC role matrix.
- Staff/admin access follows established operational permissions.

## Stripe trust-boundary tests
- Browser cannot submit arbitrary Stripe Customer IDs or Price IDs.
- Browser cannot submit arbitrary add-on amounts or currencies.
- Browser cannot submit subscription status as authoritative state.
- Checkout completion is confirmed only through verified Stripe webhooks.
- Portal sessions are created only for the authenticated client's mapped Stripe Customer.
- Unknown Stripe Product/Price mappings fail safely.

## Webhook security
- Invalid or missing Stripe signatures are rejected.
- Duplicate Stripe event IDs create no duplicate billing effect.
- Failed processing remains retryable.
- Event processing status/errors are recorded without secrets.
- Unsupported event types do not mutate billing state.
- Stripe object relationships are validated before synchronization.

## Secrets and repository tests
- No Stripe secret key or webhook secret in source.
- No Supabase service-role key in client code.
- No GitHub PAT/access token in repository files.
- Development, preview, and production credentials/data are separated.
- Secret scanning runs before release.

## Database/RLS tests
- RLS enabled on every billing table.
- Anonymous access denied.
- Client reads scoped through authenticated CPC identity.
- Billing events and entitlements have no browser write path.
- Unique Stripe event/customer/subscription mappings prevent duplicates.

## Reliability/abuse tests
- Billing endpoints are rate limited.
- Replayed webhooks are safe.
- Concurrent delivery cannot double-apply entitlement changes.
- Provider failures cannot produce false payment success.
- Retries cannot create duplicate customers/subscriptions/transactions.
- Client errors expose no secrets, stack traces, or sensitive provider payloads.

## Release gate
Production release requires all security tests to pass plus complete Stripe → verified webhook → Supabase → entitlement end-to-end verification. Any failed security test blocks release.
