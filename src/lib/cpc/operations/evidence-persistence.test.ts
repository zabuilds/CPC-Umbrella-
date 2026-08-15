import { describe, expect, it } from "vitest";

import {
  fromEvidencePersistenceRow,
  toEvidencePersistenceRow,
} from "./evidence-persistence";

describe("CPC evidence persistence mapping", () => {
  const metadata = {
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

  it("maps application metadata to the database row shape", () => {
    expect(toEvidencePersistenceRow(metadata)).toMatchObject({
      client_id: "client_1",
      property_id: "property_1",
      inspection_id: "inspection_1",
      issue_id: "issue_1",
      kind: "photo",
      filename: "front.jpg",
    });
  });

  it("maps a database row back to validated application metadata", () => {
    const row = toEvidencePersistenceRow(metadata);
    expect(fromEvidencePersistenceRow(row)).toEqual(metadata);
  });
});
