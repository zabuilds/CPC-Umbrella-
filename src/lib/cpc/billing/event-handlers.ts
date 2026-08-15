import "server-only";

import Stripe from "stripe";

import { reconcileSubscription } from "./reconcile";

export type BillingHandlerResult =
  | { kind: "subscription"; transition: ReturnType<typeof reconcileSubscription> }
  | { kind: "ignored"; eventType: string };

export function handleStripeBillingEvent(event: Stripe.Event): BillingHandlerResult {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return {
        kind: "subscription",
        transition: reconcileSubscription(event.data.object as Stripe.Subscription),
      };
    case "checkout.session.completed":
    case "invoice.paid":
    case "invoice.payment_failed":
      return { kind: "ignored", eventType: event.type };
    default:
      return { kind: "ignored", eventType: event.type };
  }
}
