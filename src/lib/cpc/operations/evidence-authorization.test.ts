import { describe, expect, it } from "vitest";

import { canAccessEvidence, requireEvidenceAccess } from "./evidence-authorization";

describe("CPC evidence authorization", () => {
  it("allows clients to read evidence", () => {
    expect(canAccessEvidence("owner", "read")).toBe(true);
  });

  it("allows operations and inspectors to create evidence", () => {
    expect(canAccessEvidence("operations", "create")).toBe(true);
    expect(canAccessEvidence("inspector", "create")).toBe(true);
  });

  it("prevents operations and inspectors from deleting evidence", () => {
    expect(canAccessEvidence("operations", "delete")).toBe(false);
    expect(canAccessEvidence("inspector", "delete")).toBe(false);
    expect(() => requireEvidenceAccess("inspector", "delete")).toThrow(
      "Evidence action not permitted: delete",
    );
  });

  it("allows administrative roles to manage evidence", () => {
    expect(canAccessEvidence("admin", "delete")).toBe(true);
    expect(canAccessEvidence("owner", "update")).toBe(true);
  });

  it("keeps vendor evidence access read-only", () => {
    expect(canAccessEvidence("vendor", "read")).toBe(true);
    expect(canAccessEvidence("vendor", "create")).toBe(false);
    expect(canAccessEvidence("vendor", "update")).toBe(false);
    expect(canAccessEvidence("vendor", "delete")).toBe(false);
  });
});
