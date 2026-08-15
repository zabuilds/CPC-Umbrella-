import "server-only";

export const CPC_EVIDENCE_ROLES = ["owner", "admin", "operations", "inspector"] as const;
export type CpcEvidenceRole = (typeof CPC_EVIDENCE_ROLES)[number];

export type EvidenceAction = "read" | "create" | "update" | "delete";

const roleActions: Record<CpcEvidenceRole, readonly EvidenceAction[]> = {
  owner: ["read", "create", "update", "delete"],
  admin: ["read", "create", "update", "delete"],
  operations: ["read", "create", "update"],
  inspector: ["read", "create", "update"],
};

export function canAccessEvidence(role: CpcEvidenceRole, action: EvidenceAction) {
  return roleActions[role].includes(action);
}

export function requireEvidenceAccess(role: CpcEvidenceRole, action: EvidenceAction) {
  if (!canAccessEvidence(role, action)) {
    throw new Error(`Evidence action not permitted: ${action}`);
  }
}
