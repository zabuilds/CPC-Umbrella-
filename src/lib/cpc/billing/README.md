# CPC Billing Domain

This module contains provider-neutral CPC billing contracts and webhook idempotency primitives.

## Construction boundary
- Stripe is the billing provider.
- Pricing and live Stripe objects are authoritative outside this module and must not be invented here.
- Provider secrets and webhook signing secrets are server-only.
- Webhook signature verification belongs in the server adapter.
- Database state transitions belong behind the CPC data-access layer.
- Webhook processing must be idempotent using the provider event ID as the uniqueness boundary.
- Checkout and Customer Portal session creation must be server-side operations.

## Current status
The domain contract and idempotency primitives are implemented without adding the Stripe SDK or making live Stripe calls. This intentionally keeps construction safe while Vercel environment configuration and authenticated RLS test gates remain unresolved.
