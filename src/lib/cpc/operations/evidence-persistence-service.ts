import "server-only";

import {
  requireEvidenceAccess,
  type CpcEvidenceRole,
  type EvidenceAction,
} from "./evidence-authorization";
import {
  toEvidencePersistenceRow,
  type EvidencePersistenceRow,
} from "./evidence-persistence";
import { buildEvidenceMetadata, type EvidenceMetadata } from "./evidence-metadata";

export type EvidencePersistencePort = {
  insert(row: EvidencePersistenceRow): Promise<void>;
  update(id: string, row: EvidencePersistenceRow): Promise<void>;
  delete(id: string): Promise<void>;
};

export async function createEvidenceMetadata(
  actorRole: CpcEvidenceRole,
  input: EvidenceMetadata,
  persistence: EvidencePersistencePort,
) {
  requireEvidenceAccess(actorRole, "create");
  const metadata = buildEvidenceMetadata(input);
  await persistence.insert(toEvidencePersistenceRow(metadata));
  return metadata;
}

export async function updateEvidenceMetadata(
  actorRole: CpcEvidenceRole,
  input: EvidenceMetadata,
  persistence: EvidencePersistencePort,
) {
  requireEvidenceAccess(actorRole, "update");
  const metadata = buildEvidenceMetadata(input);
  await persistence.update(metadata.id, toEvidencePersistenceRow(metadata));
  return metadata;
}

export async function deleteEvidenceMetadata(
  actorRole: CpcEvidenceRole,
  evidenceId: string,
  persistence: EvidencePersistencePort,
) {
  requireEvidenceAccess(actorRole, "delete");
  if (!evidenceId) throw new Error("Evidence id is required");
  await persistence.delete(evidenceId);
}

export function assertEvidenceAction(
  actorRole: CpcEvidenceRole,
  action: EvidenceAction,
) {
  requireEvidenceAccess(actorRole, action);
}
