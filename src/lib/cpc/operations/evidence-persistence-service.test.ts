import { describe, expect, it, vi } from "vitest";

import {
  createEvidenceMetadata,
  deleteEvidenceMetadata,
  updateEvidenceMetadata,
} from "./evidence-persistence-service";

const metadata = {
  id: "evidence_1",
  clientId: "client_1",
  propertyId: "property_1",
  inspectionId: "inspection_1",
  kind: "photo" as const,
  storagePath: "clients/client_1/properties/property_1/inspections/inspection_1/evidence/evidence_1/front.jpg",
  filename: "front.jpg",
  mimeType: "image/jpeg",
  createdAt: "2026-08-20T14:01:00Z",
};

describe("CPC evidence persistence service", () => {
  it("allows an inspector to create evidence", async () => {
    const persistence = { insert: vi.fn(), update: vi.fn(), delete: vi.fn() };
    await createEvidenceMetadata("inspector", metadata, persistence);
    expect(persistence.insert).toHaveBeenCalledOnce();
  });

  it("prevents vendors from creating evidence", async () => {
    const persistence = { insert: vi.fn(), update: vi.fn(), delete: vi.fn() };
    await expect(createEvidenceMetadata("vendor", metadata, persistence)).rejects.toThrow(
      "Evidence action not permitted: create",
    );
    expect(persistence.insert).not.toHaveBeenCalled();
  });

  it("allows operations to update evidence", async () => {
    const persistence = { insert: vi.fn(), update: vi.fn(), delete: vi.fn() };
    await updateEvidenceMetadata("operations", metadata, persistence);
    expect(persistence.update).toHaveBeenCalledOnce();
  });

  it("prevents inspectors from deleting evidence", async () => {
    const persistence = { insert: vi.fn(), update: vi.fn(), delete: vi.fn() };
    await expect(deleteEvidenceMetadata("inspector", "evidence_1", persistence)).rejects.toThrow(
      "Evidence action not permitted: delete",
    );
    expect(persistence.delete).not.toHaveBeenCalled();
  });
});
