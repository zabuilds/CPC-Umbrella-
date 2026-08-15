import "server-only";

import { getStripeClient } from "./stripe-adapter";
import { requireBillingPriceId } from "./price-authorization";

function requireClientId(clientId: string) {
  if (!clientId || !/^[0-9a-f-]{36}$/i.test(clientId)) {
    throw new Error("Invalid CPC client id");
  }
  return clientId;
}

export async function createCpcCheckoutSession(input: {
  clientId: string;
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const clientId = requireClientId(input.clientId);
  const priceId = requireBillingPriceId(input.priceId);

  const stripe = getStripeClient();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: input.customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: { cpc_client_id: clientId },
    subscription_data: {
      metadata: { cpc_client_id: clientId },
    },
  });
}

export async function createCpcCustomerPortalSession(input: {
  clientId: string;
  customerId: string;
  returnUrl: string;
}) {
  const clientId = requireClientId(input.clientId);
  if (!input.customerId) throw new Error("Stripe customer id is required");

  const stripe = getStripeClient();
  const billingState = await stripe.customers.retrieve(input.customerId);

  if (billingState.deleted) throw new Error("Stripe customer is deleted");
  if (billingState.metadata?.cpc_client_id !== clientId) {
    throw new Error("Stripe customer does not belong to CPC client");
  }

  return stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: input.returnUrl,
  });
}
