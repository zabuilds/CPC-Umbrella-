# CPC Billing API & Security Package

## Scope
Authoritative implementation package for CPC billing. Stripe is the payment authority; Supabase is synchronized CPC application billing state.

## API contracts

### POST /api/billing/checkout
Authenticated CPC client requests checkout for an approved CPC service plan.
- Input: `service_plan_code`
- Server resolves authenticated client and approved `service_plans` row.
- Server resolves/creates the mapped Stripe Customer.
- Server resolves the mapped Stripe Price; browser-supplied Stripe Price IDs are rejected.
- Server creates Checkout Session.
- Response: checkout session URL/reference.
- Billing activation is confirmed by verified Stripe webhook, never by browser redirect.

### POST /api/billing/portal
Authenticated CPC client requests billing self-service.
- No Stripe Customer ID accepted from browser.
- Server resolves CPC client → billing customer → Stripe Customer.
- Server creates Customer Portal session.
- Response: portal session URL/reference.

### POST /api/billing/subscription/change
Authenticated CPC client requests an approved target service plan.
- Input: `target_service_plan_code`.
- Server resolves target plan and approved Stripe Price.
- Server resolves the client's active Stripe Subscription.
- Server applies only the approved commercial/proration policy.
- Stripe webhook becomes authoritative for resulting state.

### POST /api/billing/add-ons
Authenticated CPC client/staff workflow requests an approved add-on.
- Input identifies approved add-on and eligible CPC property/service context.
- Server resolves the approved amount/Stripe configuration.
- Browser cannot provide arbitrary amount, currency, Stripe Price ID, or customer ID.
- Successful payment is recorded from verified Stripe events.

### POST /api/billing/webhook
Server-side Stripe webhook endpoint.
- Read raw request body.
- Verify Stripe signature using server-only webhook secret.
- Extract unique Stripe event ID.
- Insert/check `billing_events` idempotency record.
- Route supported event.
- Update synchronized billing state transactionally where possible.
- Recalculate entitlement.
- Mark event processed only after successful handling.
- Failed processing remains retryable and records an error.

### GET /api/billing/status
Authenticated CPC client retrieves synchronized billing state.
- Server scopes response to authenticated CPC client.
- Never expose secret Stripe fields or internal webhook payloads.
- Subscription status comes from synchronized server state, not client input.

## Authorization model
- Authentication required for all client billing endpoints except the Stripe webhook.
- Client identity derives from the authenticated session.
- Every billing lookup resolves through the CPC client relationship.
- Clients may read only their own billing customer, subscriptions, transactions, and entitlements.
- Clients cannot directly insert/update/delete billing state.
- Staff/admin access must follow the established CPC role matrix.
- Webhook processing is server-side only.
- Service-role/database administrative credentials remain server-only.

## Billing data boundaries
`service_plans`: public/readable only for active approved plans; mutation restricted to authorized internal workflows.
`billing_customers`: client read scoped to own customer; mutation server-side.
`billing_subscriptions`: client read scoped to own subscription; mutation server-side/webhook synchronization.
`billing_entitlements`: client read scoped to own entitlements; mutation server-side only.
`billing_events`: server-side audit/idempotency ledger; no browser-facing write access.
`billing_transactions`: client read scoped to own transactions; mutation server-side only.

## Security controls
- Stripe webhook signature verification mandatory.
- `stripe_event_id` unique and used for idempotency.
- Reject/reconcile unknown Stripe Product/Price mappings rather than silently creating CPC plans.
- Never trust browser-provided subscription status, payment status, customer ID, amount, or entitlement.
- Never expose Stripe secret key, webhook secret, or Supabase service-role credential to client bundles.
- Never commit secrets to GitHub.
- Separate development, preview, and production credentials/data.
- Rate-limit checkout, portal, subscription-change, and add-on endpoints.
- Log security-relevant failures without logging secrets or full sensitive payment payloads.
- Validate webhook event type and expected Stripe object relationships.
- Use server-side transaction boundaries to prevent partial billing-state updates.

## Error contract
Return safe, stable application errors; do not expose provider secrets or internal stack traces.
- `400`: invalid request/unsupported plan/add-on.
- `401`: unauthenticated.
- `403`: authenticated but not authorized for requested billing resource.
- `404`: requested CPC billing resource not found within caller scope.
- `409`: conflicting subscription/billing state.
- `422`: validation/business-rule failure.
- `429`: rate limit.
- `500/502`: server/provider failure; do not report billing success.

## Deployment gate
Before production release, verify typecheck, tests, production build, environment separation, secret scan, RLS, webhook signature verification, idempotency, client isolation, and complete Stripe → webhook → Supabase → entitlement flow.

## Pricing gate
No Stripe Prices are created until approved CPC pricing is verified. Do not invent plan amounts, intervals, trials, proration, tax, refund, or add-on policies.
