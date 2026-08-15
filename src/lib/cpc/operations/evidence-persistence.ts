import "server-only";

import { buildEvidenceMetadata, type EvidenceMetadata } from "./evidence-metadata";

export type EvidencePersistenceRow = {
  id: string;
  client_id: string;
  property_id: string;
  inspection_id: string;
  issue_id?: string | null;
  kind: EvidenceMetadata["kind"];
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes?: number | null;
  captured_at?: string | null;
  caption?: string | null;
  created_at: string;
};

export function toEvidencePersistenceRow(input: EvidenceMetadata): EvidencePersistenceRow {
  const metadata = buildEvidenceMetadata(input);
  return {
    id: metadata.id,
    client_id: metadata.clientId,
    property_id: metadata.propertyId,
    inspection_id: metadata.inspectionId,
    issue_id: metadata.issueId ?? null,
    kind: metadata.kind,
    storage_path: metadata.storagePath,
    filename: metadata.filename,
    mime_type: metadata.mimeType,
    size_bytes: metadata.sizeBytes ?? null,
    captured_at: metadata.capturedAt ?? null,
    caption: metadata.caption ?? null,
    created_at: metadata.createdAt,
  };
}

export function fromEvidencePersistenceRow(row: EvidencePersistenceRow): EvidenceMetadata {
  return buildEvidenceMetadata({
    id: row.id,
    clientId: row.client_id,
    propertyId: row.property_id,
    inspectionId: row.inspection_id,
    issueId: row.issue_id ?? undefined,
    kind: row.kind,
    storagePath: row.storage_path,
    filename: row.filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes ?? undefined,
    capturedAt: row.captured_at ?? undefined,
    caption: row.caption ?? undefined,
    createdAt: row.created_at,
  });
}
