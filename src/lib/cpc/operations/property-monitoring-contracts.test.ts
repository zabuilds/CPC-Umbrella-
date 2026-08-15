import { describe, expect, it } from "vitest";

import {
  buildEvidenceRecord,
  buildFindingRecord,
  buildPropertyCheckRecord,
} from "./property-monitoring-contracts";

describe("CPC property monitoring contracts", () => {
  it("builds a valid property check", () => {
    expect(buildPropertyCheckRecord({
      id: "check_1",
      propertyId: "property_1",
      scheduledFor: "2026-08-20T14:00:00Z",
      status: "scheduled",
    })).toMatchObject({ propertyId: "property_1", status: "scheduled" });
  });

  it("requires a property for a check", () => {
    expect(() => buildPropertyCheckRecord({
      id: "check_1",
      propertyId: "",
      scheduledFor: "2026-08-20T14:00:00Z",
      status: "scheduled",
    })).toThrow("Property id is required");
  });

  it("requires a title for findings", () => {
    expect(() => buildFindingRecord({
      id: "finding_1",
      propertyCheckId: "check_1",
      severity: "medium",
      title: "   ",
      requiresFollowUp: true,
      requiresEscalation: false,
    })).toThrow("Finding title is required");
  });

  it("requires a storage path for evidence", () => {
    expect(() => buildEvidenceRecord({
      id: "evidence_1",
      propertyCheckId: "check_1",
      kind: "photo",
      storagePath: "   ",
    })).toThrow("Evidence storage path is required");
  });
});
