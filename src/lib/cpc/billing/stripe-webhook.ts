import { z } from "zod";
import {
  cpcBillingEventSchema,
  cpcBillingProviderSchema,
} from "./contracts";
import {
  createBillingEventClaim,
  type BillingEventClaimResult,
} from "./webhook-idempotency";

const webhookInputSchema = z.object({
  provider: cpcBillingProviderSchema,
  providerEventId: z.string().min(1),
  eventType: cpcBillingEventSchema,
  receivedAt: z.string().datetime(),
});

export function validateStripeWebhookEnvelope(
  input: unknown,
  hasBeenProcessed: (providerEventId: string) => boolean,
): BillingEventClaimResult {
  const parsed = webhookInputSchema.parse(input);

  return createBillingEventClaim(
    {
      provider: "stripe",
      providerEventId: parsed.providerEventId,
      eventType: parsed.eventType,
      receivedAt: parsed.receivedAt,
    },
    hasBeenProcessed,
  );
}

/**
 * Signature verification belongs at the HTTP boundary using the official
 * Stripe SDK and STRIPE_WEBHOOK_SECRET. This module deliberately accepts only
 * the normalized, verified envelope so secrets and raw provider handling do
 * not leak into CPC domain logic.
 */
export function assertStripeWebhookSecretConfigured(): void {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
}
