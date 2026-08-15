import "server-only";

export const EVIDENCE_KINDS = ["photo", "video", "document"] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export type EvidenceAccessRequest = {
  clientId: string;
  propertyId: string;
  inspectionId: string;
  evidenceId: string;
};

export function validateEvidenceAccessRequest(input: EvidenceAccessRequest) {
  if (!input.clientId) throw new Error("Client id is required");
  if (!input.propertyId) throw new Error("Property id is required");
  if (!input.inspectionId) throw new Error("Inspection id is required");
  if (!input.evidenceId) throw new Error("Evidence id is required");
  return input;
}

export function buildPrivateEvidencePath(input: {
  clientId: string;
  propertyId: string;
  inspectionId: string;
  evidenceId: string;
  filename: string;
}) {
  validateEvidenceAccessRequest(input);
  const filename = input.filename.trim().replace(/^\/+/, "");
  if (!filename || filename.includes("..")) {
    throw new Error("Invalid evidence filename");
  }

  return `clients/${input.clientId}/properties/${input.propertyId}/inspections/${input.inspectionId}/evidence/${input.evidenceId}/${filename}`;
}
