import { describe, expect, it } from "vitest";

import { requireBillingPriceId } from "./price-authorization";

describe("CPC billing price selection", () => {
  it("accepts a configured price identifier without defining what the price costs", () => {
    expect(requireBillingPriceId("price_configured_later")).toBe("price_configured_later");
  });

  it("rejects an empty price identifier", () => {
    expect(() => requireBillingPriceId("")).toThrow("Billing price selection is required");
    expect(() => requireBillingPriceId("   ")).toThrow("Billing price selection is required");
  });
});
