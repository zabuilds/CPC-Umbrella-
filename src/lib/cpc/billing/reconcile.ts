import "server-only";

import Stripe from "stripe";

import { cpcBillingStatusSchema } from "./contracts";
import { getStripeClient } from "./stripe-adapter";

export type CpcBillingTransition = {
  clientId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: ReturnType<typeof cpcBillingStatusSchema.parse>;
};

function getClientId(metadata: Stripe.Metadata): string {
  const clientId = metadata.cpc_client_id;
  if (!clientId) throw new Error("Stripe object is missing cpc_client_id metadata");
  return clientId;
}

export function reconcileSubscription(
  subscription: Stripe.Subscription,
): CpcBillingTransition {
  const customerId = typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price.id ?? null;

  return {
    clientId: getClientId(subscription.metadata),
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    status: cpcBillingStatusSchema.parse(subscription.status),
  };
}

export async function fetchSubscription(subscriptionId: string) {
  return getStripeClient().subscriptions.retrieve(subscriptionId);
}
