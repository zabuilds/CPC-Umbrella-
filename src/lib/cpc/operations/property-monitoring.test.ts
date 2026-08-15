import { describe, expect, it } from "vitest";

import {
  canTransitionPropertyCheck,
  requireFindingSeverity,
  requiresEscalation,
  transitionPropertyCheck,
} from "./property-monitoring";

describe("CPC property monitoring state machine", () => {
  it("allows the normal check lifecycle", () => {
    expect(transitionPropertyCheck("scheduled", "assigned")).toBe("assigned");
    expect(transitionPropertyCheck("assigned", "in_progress")).toBe("in_progress");
    expect(transitionPropertyCheck("in_progress", "completed")).toBe("completed");
  });

  it("allows cancellation before completion", () => {
    expect(canTransitionPropertyCheck("scheduled", "cancelled")).toBe(true);
    expect(canTransitionPropertyCheck("in_progress", "cancelled")).toBe(true);
  });

  it("blocks invalid terminal-state transitions", () => {
    expect(canTransitionPropertyCheck("completed", "in_progress")).toBe(false);
    expect(() => transitionPropertyCheck("completed", "in_progress")).toThrow(
      "Invalid property check transition",
    );
  });

  it("requires escalation for high and critical findings", () => {
    expect(requiresEscalation(requireFindingSeverity("high"))).toBe(true);
    expect(requiresEscalation(requireFindingSeverity("critical"))).toBe(true);
    expect(requiresEscalation(requireFindingSeverity("medium"))).toBe(false);
  });

  it("rejects unknown finding severities", () => {
    expect(() => requireFindingSeverity("urgent")).toThrow("Invalid finding severity");
  });
});
