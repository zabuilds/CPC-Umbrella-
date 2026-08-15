import { describe, expect, it } from "vitest";

import { handleStripeBillingEvent } from "./event-handlers";

function subscriptionEvent(type: "customer.subscription.created" | "customer.subscription.updated" | "customer.subscription.deleted") {
  return {
    id: `evt_${type.replaceAll(".", "_")}`,
    object: "event",
    type,
    data: {
      object: {
        id: "sub_test",
        object: "subscription",
        customer: "cus_test",
        metadata: { cpc_client_id: "00000000-0000-0000-0000-000000000001" },
        status: "active",
        items: { data: [{ price: { id: "price_test" } }] },
      },
    },
  } as never;
}

describe("CPC Stripe billing event handlers", () => {
  it("reconciles subscription creation", () => {
    const result = handleStripeBillingEvent(subscriptionEvent("customer.subscription.created"));
    expect(result.kind).toBe("subscription");
    if (result.kind === "subscription") {
      expect(result.transition.clientId).toBe("00000000-0000-0000-0000-000000000001");
      expect(result.transition.stripeSubscriptionId).toBe("sub_test");
      expect(result.transition.status).toBe("active");
    }
  });

  it("handles subscription updates and cancellations through the same reconciliation boundary", () => {
    expect(handleStripeBillingEvent(subscriptionEvent("customer.subscription.updated")).kind).toBe("subscription");
    expect(handleStripeBillingEvent(subscriptionEvent("customer.subscription.deleted")).kind).toBe("subscription");
  });

  it("ignores supported non-subscription billing events until their state handlers are implemented", () => {
    const result = handleStripeBillingEvent({
      id: "evt_invoice",
      object: "event",
      type: "invoice.payment_failed",
      data: { object: {} },
    } as never);
    expect(result).toEqual({ kind: "ignored", eventType: "invoice.payment_failed" });
  });

  it("rejects subscriptions without CPC client metadata", () => {
    expect(() => handleStripeBillingEvent({
      id: "evt_bad",
      object: "event",
      type: "customer.subscription.created",
      data: {
        object: {
          id: "sub_bad",
          object: "subscription",
          customer: "cus_bad",
          metadata: {},
          status: "active",
          items: { data: [{ price: { id: "price_test" } }] },
        },
      },
    } as never)).toThrow("cpc_client_id");
  });
});
