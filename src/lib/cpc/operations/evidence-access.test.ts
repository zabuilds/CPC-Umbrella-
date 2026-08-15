import { describe, expect, it } from "vitest";

import {
  buildPrivateEvidencePath,
  validateEvidenceAccessRequest,
} from "./evidence-access";

describe("CPC evidence access boundary", () => {
  const request = {
    clientId: "client_1",
    propertyId: "property_1",
    inspectionId: "inspection_1",
    evidenceId: "evidence_1",
  };

  it("requires the full ownership context", () => {
    expect(validateEvidenceAccessRequest(request)).toEqual(request);
    expect(() => validateEvidenceAccessRequest({ ...request, propertyId: "" }))
      .toThrow("Property id is required");
  });

  it("builds a tenant-scoped private storage path", () => {
    expect(buildPrivateEvidencePath({
      ...request,
      filename: "front-exterior.jpg",
    })).toBe(
      "clients/client_1/properties/property_1/inspections/inspection_1/evidence/evidence_1/front-exterior.jpg",
    );
  });

  it("rejects path traversal", () => {
    expect(() => buildPrivateEvidencePath({
      ...request,
      filename: "../private.jpg",
    })).toThrow("Invalid evidence filename");
  });
});
