import "server-only";

export const PROPERTY_CHECK_STATUSES = [
  "scheduled",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export const FINDING_SEVERITIES = ["info", "low", "medium", "high", "critical"] as const;

export type PropertyCheckStatus = (typeof PROPERTY_CHECK_STATUSES)[number];
export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

const transitions: Record<PropertyCheckStatus, readonly PropertyCheckStatus[]> = {
  scheduled: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canTransitionPropertyCheck(
  from: PropertyCheckStatus,
  to: PropertyCheckStatus,
) {
  return transitions[from].includes(to);
}

export function transitionPropertyCheck(
  from: PropertyCheckStatus,
  to: PropertyCheckStatus,
): PropertyCheckStatus {
  if (!canTransitionPropertyCheck(from, to)) {
    throw new Error(`Invalid property check transition: ${from} -> ${to}`);
  }
  return to;
}

export function requireFindingSeverity(value: string): FindingSeverity {
  if (!FINDING_SEVERITIES.includes(value as FindingSeverity)) {
    throw new Error("Invalid finding severity");
  }
  return value as FindingSeverity;
}

export function requiresEscalation(severity: FindingSeverity) {
  return severity === "high" || severity === "critical";
}
