import "server-only";

import { EVIDENCE_KINDS, type EvidenceKind } from "./evidence-access";

export type EvidenceMetadata = {
  id: string;
  clientId: string;
  propertyId: string;
  inspectionId: string;
  issueId?: string;
  kind: EvidenceKind;
  storagePath: string;
  filename: string;
  mimeType: string;
  sizeBytes?: number;
  capturedAt?: string;
  caption?: string;
  createdAt: string;
};

export function buildEvidenceMetadata(input: EvidenceMetadata): EvidenceMetadata {
  if (!input.id) throw new Error("Evidence id is required");
  if (!input.clientId) throw new Error("Client id is required");
  if (!input.propertyId) throw new Error("Property id is required");
  if (!input.inspectionId) throw new Error("Inspection id is required");
  if (!EVIDENCE_KINDS.includes(input.kind)) throw new Error("Invalid evidence kind");
  if (!input.storagePath.trim()) throw new Error("Evidence storage path is required");
  if (!input.filename.trim()) throw new Error("Evidence filename is required");
  if (!input.mimeType.trim()) throw new Error("Evidence MIME type is required");
  if (input.sizeBytes !== undefined && (!Number.isInteger(input.sizeBytes) || input.sizeBytes < 0)) {
    throw new Error("Evidence size must be a non-negative integer");
  }
  if (!input.createdAt) throw new Error("Evidence creation time is required");
  return input;
}
