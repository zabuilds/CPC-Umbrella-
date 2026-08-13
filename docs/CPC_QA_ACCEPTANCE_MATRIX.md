# CPC QA Acceptance Matrix

## Release rule
A CPC milestone is not complete until the affected workflow passes functional, authorization, validation, responsive, accessibility, error-state, and regression checks.

## Client onboarding
- [ ] Create valid client.
- [ ] Required fields reject invalid/empty values.
- [ ] Duplicate business identifiers are handled safely.
- [ ] Client status transitions are valid.
- [ ] Archive behavior preserves required history.
- [ ] Unauthorized users cannot access the client.

## Property management
- [ ] Create valid property linked to the correct client.
- [ ] Required address/property fields validate.
- [ ] Client-property relationship cannot expose another client's property.
- [ ] Property status transitions are constrained.
- [ ] Archive behavior is safe and auditable.
- [ ] Property lists, search, and filters return correctly scoped data.

## Inspection lifecycle
- [ ] Schedule inspection for a valid property.
- [ ] Prevent invalid dates/status transitions.
- [ ] Assign only eligible inspectors.
- [ ] Start and complete inspection with required fields.
- [ ] Cancel/reschedule behavior preserves history.
- [ ] Inspection data is visible only to authorized users.

## Reports
- [ ] Report is associated with the correct inspection/property.
- [ ] Required findings and media metadata validate.
- [ ] Draft/published lifecycle is enforced.
- [ ] Client can access only reports for authorized properties.
- [ ] Report failure states are recoverable without duplicate records.

## Issues and vendors
- [ ] Create issue with severity and property/inspection relationship.
- [ ] Severity and lifecycle transitions are validated.
- [ ] Assign vendor only when permitted.
- [ ] Vendor sees only explicitly assigned work.
- [ ] Resolve/close actions preserve audit history.
- [ ] Client visibility follows approved portal rules.

## Security / RLS
- [ ] Anonymous access to protected CPC data is denied.
- [ ] Client A cannot read Client B's properties, inspections, reports, or issues.
- [ ] Client cannot mutate staff-controlled fields.
- [ ] Vendor cannot read unassigned property data.
- [ ] Internal roles receive only intended operational access.
- [ ] Service-role credentials never reach browser code.
- [ ] Storage access follows property/client authorization boundaries.

## UI / UX quality
- [ ] Desktop layout verified.
- [ ] Mobile layout verified.
- [ ] Keyboard navigation works for primary workflows.
- [ ] Form labels and validation messages are accessible.
- [ ] Loading, empty, success, and error states are present.
- [ ] Destructive actions require appropriate confirmation.
- [ ] No placeholder production content remains.
- [ ] Approved CPC visual system remains consistent.

## Reliability / regression
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] TypeScript typecheck passes.
- [ ] Production build passes.
- [ ] Critical routes load without console errors.
- [ ] Persistence failures surface safely to users.
- [ ] Query invalidation does not leak data across scopes.
- [ ] No secrets are committed.

## Production gate
Before a release is called production-ready, every applicable checkbox above must be verified or explicitly waived with a documented reason. No unverified integration, security boundary, test result, or deployment state may be represented as complete.
