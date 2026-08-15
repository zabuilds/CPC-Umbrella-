import { describe, expect, it, vi } from "vitest";

import { upsertBillingState } from "./state-repository";

const upsert = vi.fn();
const from = vi.fn(() => ({ upsert }));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdminClient: () => ({ from }),
}));

describe("CPC billing state repository", () => {
  it("upserts the Stripe-to-client billing mapping", async () => {
    upsert.mockReturnValueOnce({
      select: () => ({
        single: async () => ({
          data: { id: "billing-1", client_id: "client-1", status: "active" },
          error: null,
        }),
      }),
    });

    const result = await upsertBillingState({
      clientId: "00000000-0000-0000-0000-000000000001",
      stripeCustomerId: "cus_test",
      stripeSubscriptionId: "sub_test",
      stripePriceId: "price_test",
      status: "active",
    });

    expect(result.status).toBe("active");
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "stripe",
        stripe_customer_id: "cus_test",
        stripe_subscription_id: "sub_test",
        status: "active",
      }),
      { onConflict: "provider,stripe_customer_id" },
    );
  });

  it("surfaces persistence failures", async () => {
    upsert.mockReturnValueOnce({
      select: () => ({
        single: async () => ({ data: null, error: new Error("db failure") }),
      }),
    });

    await expect(
      upsertBillingState({
        clientId: "00000000-0000-0000-0000-000000000001",
        stripeCustomerId: "cus_test",
        stripeSubscriptionId: null,
        stripePriceId: null,
        status: "canceled",
      }),
    ).rejects.toThrow("db failure");
  });
});
