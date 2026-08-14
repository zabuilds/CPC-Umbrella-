# CPC Authorization Verification

## Production-safe verification mode

The CPC construction branch does not create a paid Supabase development branch for authorization testing at this stage.

Instead, authorization is verified against the live schema metadata using read-only inspection of `pg_policies`. This confirms the deployed RLS policy definitions without mutating production data.

## Verified policy boundaries

- Clients: authenticated client owner, admin, and operations access.
- Properties: client ownership through the client relationship, plus admin/operations access.
- Inspections: assigned inspector access, client ownership through the property relationship, plus admin/operations access.
- Issues: reporter access, client ownership through the property relationship, plus admin/operations access.
- Inspection reports: client ownership or assigned inspector access, plus admin/operations access.
- Property contacts: client ownership through the property relationship, plus admin/operations access.
- Vendors: admin/operations/inspector internal access only.
- Profiles: self access, with admin/operations read access; profile updates are self-only.

## Important limitation

This validates the policy definitions and their intended boundaries, but it is not a substitute for runtime impersonation tests using separate authenticated fixtures. Those tests remain deferred until a disposable Supabase branch is approved.

## Construction gate

API construction may proceed using the verified RLS contract, but no claim of end-to-end authenticated authorization testing should be made until runtime fixture testing is performed.
