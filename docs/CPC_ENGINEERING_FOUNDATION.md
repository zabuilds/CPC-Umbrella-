# Cayman Property Check — Engineering Foundation

## Status

Construction baseline. This repository is the implementation source of truth for the CPC application build.

## Project

Cayman Property Check (CPC) — premium property oversight and owner-support platform for absentee property owners in Grand Cayman.

## Authoritative build principles

- Production-ready implementation; no placeholder architecture presented as finished work.
- Security, permissions, privacy, auditability, reliability, and maintainability are first-class requirements.
- Client, Property, Service, Inspection, Issue, Vendor, reporting, onboarding, billing, automation, and portal workflows must remain coherent across the stack.
- Inspection operations follow the approved field SOP and report standards.
- Technical defects are not diagnosed by CPC field personnel; observations are documented and escalated appropriately.
- Existing approved CPC planning and engineering decisions remain authoritative unless explicitly superseded.

## Integration sequence

1. GitHub — repository and source control
2. Supabase — database/auth/backend services
3. Vercel — application hosting/deployment
4. Stripe — billing/payments
5. Optional services as required

## Construction rule

The application scaffold is being reconciled into `cpc/construction` before feature implementation. Existing approved engineering packages remain authoritative and are not replaced by scaffold work.
