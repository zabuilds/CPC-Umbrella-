import "server-only";

import { FINDING_SEVERITIES, PROPERTY_CHECK_STATUSES } from "./property-monitoring";

export type PropertyCheckRecord = {
  id: string;
  propertyId: string;
  scheduledFor: string;
  status: (typeof PROPERTY_CHECK_STATUSES)[number];
  assignedToUserId?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
};

export type PropertyFindingRecord = {
  id: string;
  propertyCheckId: string;
  severity: (typeof FINDING_SEVERITIES)[number];
  title: string;
  description?: string;
  requiresFollowUp: boolean;
  requiresEscalation: boolean;
  resolvedAt?: string;
};

export type PropertyEvidenceRecord = {
  id: string;
  propertyCheckId: string;
  findingId?: string;
  kind: "photo" | "video" | "document";
  storagePath: string;
  capturedAt?: string;
  caption?: string;
};

export function buildPropertyCheckRecord(input: Omit<PropertyCheckRecord, "id"> & { id: string }) {
  if (!input.propertyId) throw new Error("Property id is required");
  if (!input.scheduledFor) throw new Error("Scheduled time is required");
  return input;
}

export function buildFindingRecord(input: Omit<PropertyFindingRecord, "id"> & { id: string }) {
  if (!input.propertyCheckId) throw new Error("Property check id is required");
  if (!input.title.trim()) throw new Error("Finding title is required");
  return input;
}

export function buildEvidenceRecord(input: Omit<PropertyEvidenceRecord, "id"> & { id: string }) {
  if (!input.propertyCheckId) throw new Error("Property check id is required");
  if (!input.storagePath.trim()) throw new Error("Evidence storage path is required");
  return input;
}
