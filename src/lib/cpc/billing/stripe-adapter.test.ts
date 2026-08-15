import { describe, expect, it } from "vitest";

import { mapStripeSubscription } from "./stripe-adapter";

describe("CPC Stripe adapter", () => {
  it("maps a subscription into the CPC billing contract", () => {
    const result = mapStripeSubscription({
      id: "sub_test",
      customer: "cus_test",
      metadata: { cpc_client_id: "00000000-0000-0000-0000-000000000001" },
      items: { data: [{ price: { id: "price_test" } }] },
    } as never);

    expect(result).toEqual({
      provider: "stripe",
      clientId: "00000000-0000-0000-0000-000000000001",
      stripeCustomerId: "cus_test",
      stripeSubscriptionId: "sub_test",
      stripePriceId: "price_test",
    });
  });

  it("rejects subscriptions without a price", () => {
    expect(() => mapStripeSubscription({
      id: "sub_test",
      customer: "cus_test",
      metadata: { cpc_client_id: "00000000-0000-0000-0000-000000000001" },
      items: { data: [] },
    } as never)).toThrow("no price item");
  });
});
