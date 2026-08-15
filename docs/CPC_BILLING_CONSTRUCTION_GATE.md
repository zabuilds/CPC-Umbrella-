# CPC Billing Construction Gate

## Purpose
Establish the implementation boundary for CPC billing without creating new pricing, duplicate Stripe architecture, or production billing state.

## Authoritative constraints
- Existing CPC billing architecture and pricing decisions remain authoritative.
- Do not invent or alter pricing.
- Do not create duplicate Stripe products, prices, customers, subscriptions, or payment flows.
- Use Stripe for billing and CPC/Supabase as the application-side source of mapped billing state.
- Webhooks must be treated as the authoritative asynchronous state transition mechanism.
- Webhook processing must be idempotent.
- Secrets remain server-side only.
- Billing operations must never expose Stripe secret material to the browser.

## Construction scope now
1. Define the billing-domain data contract and Stripe-to-CPC identifiers.
2. Define the webhook event/idempotency contract.
3. Define server-only billing boundaries for Checkout and Customer Portal.
4. Define failure/retry behavior and reconciliation requirements.
5. Add implementation tests/contracts before wiring live Stripe operations.

## Explicitly deferred
- Creating or modifying live Stripe products/prices.
- Creating live customers/subscriptions.
- Processing live payments.
- Changing production billing configuration.
- Adding client-visible secret configuration.

## Release gates
Billing construction is not production-ready until:
- Stripe mappings are validated against the existing CPC billing architecture.
- Webhook signature verification and idempotency are implemented and tested.
- Authorization boundaries are verified.
- Failure/retry/reconciliation behavior is covered.
- Preview deployment is healthy.
- Live Stripe operations are explicitly enabled only after all required environment configuration is present.
