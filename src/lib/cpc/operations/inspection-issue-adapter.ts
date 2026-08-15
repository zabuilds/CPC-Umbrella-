import "server-only";

import type { FindingSeverity, PropertyCheckStatus } from "./property-monitoring";

export const CPC_ISSUE_SEVERITY_MAP: Record<FindingSeverity, "urgent" | "attention" | "monitor"> = {
  info: "monitor",
  low: "monitor",
  medium: "attention",
  high: "urgent",
  critical: "urgent",
};

export const CPC_INSPECTION_STATUS_MAP: Record<PropertyCheckStatus, "scheduled" | "in_progress" | "completed" | "cancelled"> = {
  scheduled: "scheduled",
  assigned: "scheduled",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

export function toCpcInspectionStatus(status: PropertyCheckStatus) {
  return CPC_INSPECTION_STATUS_MAP[status];
}

export function toCpcIssueSeverity(severity: FindingSeverity) {
  return CPC_ISSUE_SEVERITY_MAP[severity];
}
