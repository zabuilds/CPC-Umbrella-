import { describe, expect, it } from "vitest";

import { requireBillingReturnUrl } from "./return-url";

describe("CPC billing return URL", () => {
  it("accepts an HTTPS application URL without credentials", () => {
    expect(requireBillingReturnUrl("https://example.cpc.test/billing/complete"))
      .toBe("https://example.cpc.test/billing/complete");
  });

  it("rejects non-HTTPS URLs", () => {
    expect(() => requireBillingReturnUrl("http://example.cpc.test/billing"))
      .toThrow("Billing return URL must use HTTPS");
  });

  it("rejects URLs containing credentials", () => {
    expect(() => requireBillingReturnUrl("https://user:pass@example.cpc.test/billing"))
      .toThrow("Billing return URL cannot contain credentials");
  });
});
