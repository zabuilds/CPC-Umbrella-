import { z } from "zod";

export const cpcBillingProviderSchema = z.literal("stripe");
export const cpcBillingStatusSchema = z.enum([
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
]);

export const cpcBillingEventSchema = z.enum([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

export const cpcBillingMappingSchema = z.object({
  provider: cpcBillingProviderSchema,
  clientId: z.string().uuid(),
  stripeCustomerId: z.string().min(1),
  stripeSubscriptionId: z.string().min(1).optional(),
  stripePriceId: z.string().min(1).optional(),
});

export const cpcBillingEventRecordSchema = z.object({
  provider: cpcBillingProviderSchema,
  providerEventId: z.string().min(1),
  eventType: cpcBillingEventSchema,
  receivedAt: z.string().datetime(),
});

export type CpcBillingStatus = z.infer<typeof cpcBillingStatusSchema>;
export type CpcBillingEvent = z.infer<typeof cpcBillingEventSchema>;
export type CpcBillingMapping = z.infer<typeof cpcBillingMappingSchema>;
export type CpcBillingEventRecord = z.infer<typeof cpcBillingEventRecordSchema>;

export const CPC_BILLING_EVENT_TO_STATUS: Partial<
  Record<CpcBillingEvent, CpcBillingStatus>
> = {
  "customer.subscription.created": "active",
  "customer.subscription.updated": "active",
  "customer.subscription.deleted": "canceled",
  "invoice.paid": "active",
};

export const CPC_BILLING_SECRET_ENV_KEYS = {
  secretKey: "STRIPE_SECRET_KEY",
  webhookSecret: "STRIPE_WEBHOOK_SECRET",
} as const;

/**
 * Server-only billing boundaries are enforced by the modules that consume these
 * contracts. Never expose provider secret keys or webhook signing secrets to the browser.
 */
export const CPC_BILLING_PROVIDER = "stripe" as const;
