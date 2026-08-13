# CPC Repository Structure

## Purpose

This repository is the controlled engineering workspace for Cayman Property Check.

## Planned top-level structure

- `app/` — Next.js application routes and pages
- `components/` — reusable UI components
- `lib/` — application services, integrations, utilities, and domain logic
- `supabase/` — database migrations, seed data, and Supabase configuration
- `public/` — approved static assets
- `docs/` — authoritative engineering and operational specifications
- `tests/` — automated unit, integration, and end-to-end tests
- `.github/` — CI/CD, issue templates, and repository automation

## Rules

- Secrets never enter source control.
- Production configuration is supplied through environment variables/secrets management.
- Database changes are represented by migrations.
- Domain logic should be testable independently of UI components.
- UI should follow the approved CPC design system and accessibility requirements.
- Changes should be small, reviewable, and traceable.
- Do not add unrelated experiments or disposable prototypes.
