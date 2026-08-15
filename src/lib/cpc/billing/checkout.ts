import "server-only";

import { getStripeClient } from "./stripe-adapter";

export async function createCpcCheckoutSession(input: {
  customerId?: string;
  clientId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripeClient();

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: input.customerId,
    line_items: [{ price: input.priceId, quantity: 1 }],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: { cpc_client_id: input.clientId },
    subscription_data: {
      metadata: { cpc_client_id: input.clientId },
    },
  });
}
