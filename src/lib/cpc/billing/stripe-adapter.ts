import "server-only";

import Stripe from "stripe";

import {
  CPC_BILLING_PROVIDER,
  cpcBillingEventRecordSchema,
  cpcBillingMappingSchema,
} from "./contracts";
import { buildCpcWebhookIdempotencyKey } from "./idempotency";

function requireEnv(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function getStripeClient(): Stripe {
  return new Stripe(requireEnv("STRIPE_SECRET_KEY"));
}

export function constructStripeWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  return getStripeClient().webhooks.constructEvent(
    payload,
    signature,
    requireEnv("STRIPE_WEBHOOK_SECRET"),
  );
}

export function mapStripeSubscription(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price.id;

  if (!priceId) throw new Error("Stripe subscription has no price item");

  return cpcBillingMappingSchema.parse({
    provider: CPC_BILLING_PROVIDER,
    clientId: subscription.metadata.cpc_client_id,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
  });
}

export function mapStripeWebhookEvent(event: Stripe.Event) {
  const envelope = cpcBillingEventRecordSchema.parse({
    provider: CPC_BILLING_PROVIDER,
    providerEventId: event.id,
    eventType: event.type,
    receivedAt: new Date().toISOString(),
  });

  return {
    envelope,
    idempotencyKey: buildCpcWebhookIdempotencyKey(event.id, event.type),
  };
}
