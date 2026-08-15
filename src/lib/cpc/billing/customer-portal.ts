import "server-only";

import { getStripeClient } from "./stripe-adapter";

export async function createCpcCustomerPortalSession(input: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = getStripeClient();

  return stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: input.returnUrl,
  });
}
