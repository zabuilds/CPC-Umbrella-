import { describe, expect, it } from "vitest";

import { buildEvidenceMetadata } from "./evidence-metadata";

describe("CPC evidence metadata contract", () => {
  const valid = {
    id: "evidence_1",
    clientId: "client_1",
    propertyId: "property_1",
    inspectionId: "inspection_1",
    issueId: "issue_1",
    kind: "photo" as const,
    storagePath: "clients/client_1/properties/property_1/inspections/inspection_1/evidence/evidence_1/front.jpg",
    filename: "front.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 1024,
    capturedAt: "2026-08-20T14:00:00Z",
    caption: "Front exterior",
    createdAt: "2026-08-20T14:01:00Z",
  };

  it("accepts complete metadata", () => {
    expect(buildEvidenceMetadata(valid)).toEqual(valid);
  });

  it("requires the inspection ownership context", () => {
    expect(() => buildEvidenceMetadata({ ...valid, inspectionId: "" }))
      .toThrow("Inspection id is required");
  });

  it("rejects invalid evidence kinds", () => {
    expect(() => buildEvidenceMetadata({ ...valid, kind: "audio" as never }))
      .toThrow("Invalid evidence kind");
  });

  it("rejects invalid file sizes", () => {
    expect(() => buildEvidenceMetadata({ ...valid, sizeBytes: -1 }))
      .toThrow("Evidence size must be a non-negative integer");
  });
});
