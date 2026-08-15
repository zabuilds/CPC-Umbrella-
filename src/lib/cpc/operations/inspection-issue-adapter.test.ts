import { describe, expect, it } from "vitest";

import {
  toCpcInspectionStatus,
  toCpcIssueSeverity,
} from "./inspection-issue-adapter";

describe("CPC inspection and issue adapters", () => {
  it("maps assigned checks to the existing scheduled inspection state", () => {
    expect(toCpcInspectionStatus("assigned")).toBe("scheduled");
  });

  it("preserves existing inspection lifecycle states", () => {
    expect(toCpcInspectionStatus("scheduled")).toBe("scheduled");
    expect(toCpcInspectionStatus("in_progress")).toBe("in_progress");
    expect(toCpcInspectionStatus("completed")).toBe("completed");
    expect(toCpcInspectionStatus("cancelled")).toBe("cancelled");
  });

  it("maps the new finding severity model onto the established CPC issue model", () => {
    expect(toCpcIssueSeverity("info")).toBe("monitor");
    expect(toCpcIssueSeverity("low")).toBe("monitor");
    expect(toCpcIssueSeverity("medium")).toBe("attention");
    expect(toCpcIssueSeverity("high")).toBe("urgent");
    expect(toCpcIssueSeverity("critical")).toBe("urgent");
  });
});
