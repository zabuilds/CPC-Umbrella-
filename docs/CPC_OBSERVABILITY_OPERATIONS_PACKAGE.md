# CPC Observability & Operational Controls

## Objective
Define production monitoring for CPC application, billing, integrations, and operational workflows without exposing secrets or sensitive payment data.

## Critical signals
- Application 5xx rate and elevated error rate.
- API latency and timeout rate.
- Authentication failures and authorization denials.
- Database connection/query failures.
- RLS policy failures.
- Stripe webhook signature failures.
- Stripe webhook processing failures/retries.
- Duplicate webhook events.
- Unmapped Stripe Product/Price events.
- Subscription synchronization failures.
- Entitlement synchronization failures.
- Payment failure rate.
- Checkout creation failures.
- Customer Portal session failures.
- Add-on payment failures.
- Background automation failures.

## Billing alerts
Alert on:
1. Repeated webhook failures for the same event.
2. Growing unprocessed billing event backlog.
3. Subscription state unable to reconcile with Stripe.
4. Unknown Stripe Price/Product mapping.
5. Entitlement update failure.
6. Abnormal payment failure spike.
7. Checkout or Portal error spike.
8. Database/RLS failures affecting billing.

Alerts must include safe diagnostic identifiers, timestamps, environment, event type, and failure category. Never include secret keys, webhook secrets, full payment credentials, or unnecessary sensitive payloads.

## Audit logging
Record security-relevant actions such as:
- Authentication/authorization failures.
- Billing mutations initiated by staff/admin workflows.
- Subscription-plan changes.
- Cancellation actions.
- Add-on authorization/payment attempts.
- Webhook processing outcomes.
- Entitlement changes.
- Administrative configuration changes.

Audit records should identify actor, action, target/resource, timestamp, environment, result, and correlation/event ID where appropriate.

## Operational dashboards
Minimum views:
- Application health.
- API errors/latency.
- Billing webhook health.
- Subscription synchronization.
- Payment failures.
- Entitlement exceptions.
- Background automation health.
- Database health.

## Incident handling
Severity 1: payment integrity, authentication bypass, data exposure, or widespread production outage. Immediately block unsafe mutations where possible and escalate.

Severity 2: material billing synchronization failure, recurring webhook backlog, or major client-facing degradation without confirmed data exposure.

Severity 3: isolated non-critical workflow failures or recoverable operational errors.

Every incident should capture detection time, affected component, impact, mitigation, root cause, corrective action, and verification.

## Recovery principles
- Webhook processing must be safely retryable.
- Failed automation must not silently drop billing events.
- Reconciliation jobs may repair synchronized state but must never invent payment state.
- Stripe remains payment/subscription authority.
- Supabase remains synchronized CPC application state.
- Entitlements are recalculated from verified synchronized state.
- Recovery procedures must be tested before production launch.

## Production gate
Monitoring, alerting, audit logging, recovery procedures, and billing reconciliation must be operationally defined before CPC is declared production-ready.
