import { describe, expect, it } from "vitest";

import { buildCpcWebhookIdempotencyKey } from "./idempotency";

describe("CPC billing webhook idempotency", () => {
  it("produces a stable key for the same Stripe event", () => {
    const first = buildCpcWebhookIdempotencyKey("evt_123", "invoice.paid");
    const second = buildCpcWebhookIdempotencyKey("evt_123", "invoice.paid");

    expect(first).toBe(second);
  });

  it("keeps distinct Stripe events distinct", () => {
    expect(buildCpcWebhookIdempotencyKey("evt_123", "invoice.paid"))
      .not.toBe(buildCpcWebhookIdempotencyKey("evt_456", "invoice.paid"));
  });
});
