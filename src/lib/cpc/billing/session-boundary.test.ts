import { describe, expect, it, vi } from "vitest";

const checkoutCreate = vi.fn();
const customerRetrieve = vi.fn();
const portalCreate = vi.fn();

vi.mock("./stripe-adapter", () => ({
  getStripeClient: () => ({
    checkout: { sessions: { create: checkoutCreate } },
    customers: { retrieve: customerRetrieve },
    billingPortal: { sessions: { create: portalCreate } },
  }),
}));

import {
  createCpcCheckoutSession,
  createCpcCustomerPortalSession,
} from "./session-boundary";

const clientId = "00000000-0000-0000-0000-000000000001";

const validUrls = {
  successUrl: "https://example.cpc.test/billing/success",
  cancelUrl: "https://example.cpc.test/billing/cancel",
};

describe("CPC billing session boundary", () => {
  it("rejects invalid client ids before Stripe is called", async () => {
    await expect(createCpcCheckoutSession({
      clientId: "not-a-client",
      priceId: "price_configured_later",
      ...validUrls,
    })).rejects.toThrow("Invalid CPC client id");
    expect(checkoutCreate).not.toHaveBeenCalled();
  });

  it("rejects unsafe checkout return URLs before Stripe is called", async () => {
    await expect(createCpcCheckoutSession({
      clientId,
      priceId: "price_configured_later",
      successUrl: "http://example.cpc.test/billing/success",
      cancelUrl: validUrls.cancelUrl,
    })).rejects.toThrow("Billing return URL must use HTTPS");
    expect(checkoutCreate).not.toHaveBeenCalled();
  });

  it("passes a non-final price id and safe URLs to Checkout", async () => {
    checkoutCreate.mockResolvedValueOnce({ id: "cs_test" });

    await createCpcCheckoutSession({
      clientId,
      priceId: "price_configured_later",
      ...validUrls,
    });

    expect(checkoutCreate).toHaveBeenCalledWith(expect.objectContaining({
      line_items: [{ price: "price_configured_later", quantity: 1 }],
      success_url: validUrls.successUrl,
      cancel_url: validUrls.cancelUrl,
      metadata: { cpc_client_id: clientId },
    }));
  });

  it("rejects a portal session when the Stripe customer belongs to another CPC client", async () => {
    customerRetrieve.mockResolvedValueOnce({
      id: "cus_test",
      metadata: { cpc_client_id: "00000000-0000-0000-0000-000000000002" },
    });

    await expect(createCpcCustomerPortalSession({
      clientId,
      customerId: "cus_test",
      returnUrl: validUrls.successUrl,
    })).rejects.toThrow("does not belong to CPC client");
    expect(portalCreate).not.toHaveBeenCalled();
  });

  it("rejects an unsafe portal return URL before Stripe is called", async () => {
    await expect(createCpcCustomerPortalSession({
      clientId,
      customerId: "cus_test",
      returnUrl: "http://example.cpc.test/billing",
    })).rejects.toThrow("Billing return URL must use HTTPS");
    expect(customerRetrieve).not.toHaveBeenCalled();
  });
});
