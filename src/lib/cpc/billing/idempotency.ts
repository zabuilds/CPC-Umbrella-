import { z } from "zod";

export const cpcWebhookEnvelopeSchema = z.object({
  provider: z.literal("stripe"),
  providerEventId: z.string().min(1),
  eventType: z.string().min(1),
});

export type CpcWebhookEnvelope = z.infer<typeof cpcWebhookEnvelopeSchema>;

/**
 * Stable idempotency key for provider webhook processing.
 * The provider event ID is the durable uniqueness boundary; the event type is
 * included to make logs and traces unambiguous without changing uniqueness.
 */
export function buildCpcWebhookIdempotencyKey(
  providerEventId: string,
  eventType: string,
): string {
  return `stripe:${providerEventId}:${eventType}`;
}

/**
 * Normalize and validate the minimal webhook envelope before any state change.
 * Signature verification and provider SDK event construction belong in the
 * server-only webhook adapter, not in this pure domain module.
 */
export function parseCpcWebhookEnvelope(input: unknown): CpcWebhookEnvelope {
  return cpcWebhookEnvelopeSchema.parse(input);
}
