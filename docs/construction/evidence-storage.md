# CPC Evidence Storage Construction Checkpoint

Status: foundation deployed; authorization tightening pending.

## Live foundation
- Private Supabase Storage bucket: `cpc-evidence`
- Maximum object size: 50 MB
- Allowed MIME types: JPEG, PNG, WebP, PDF
- Public access disabled
- Uploads restricted to authenticated users under the `properties/` namespace
- Reads restricted to authenticated users at the construction stage

## Required hardening before production evidence
Storage access must be constrained by the CPC authorization relationship for the property/inspection represented by the object path. The current authenticated read policy is not the final production authorization boundary.

## Construction sequence
1. Keep bucket private.
2. Define canonical object path from property/inspection/evidence identity.
3. Resolve property authorization server-side before upload/read.
4. Tighten `storage.objects` RLS to the verified CPC relationship.
5. Persist the resulting object path in `evidence_metadata`.
6. Validate upload, read, signed access, and unauthorized cross-property denial.
