import { describe, expect, it } from "vitest";

import { reconcileSubscription } from "./reconcile";

describe("CPC billing reconciliation", () => {
  it("maps a valid Stripe subscription to CPC billing state", () => {
    const result = reconcileSubscription({
      id: "sub_test",
      customer: "cus_test",
      metadata: { cpc_client_id: "00000000-0000-0000-0000-000000000001" },
      status: "active",
      items: { data: [{ price: { id: "price_test" } }] },
    } as never);

    expect(result).toEqual({
      clientId: "00000000-0000-0000-0000-000000000001",
      stripeCustomerId: "cus_test",
      stripeSubscriptionId: "sub_test",
      stripePriceId: "price_test",
      status: "active",
    });
  });

  it("requires CPC client metadata", () => {
    expect(() => reconcileSubscription({
      id: "sub_test",
      customer: "cus_test",
      metadata: {},
      status: "active",
      items: { data: [{ price: { id: "price_test" } }] },
    } as never)).toThrow("cpc_client_id");
  });
});
