import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

import type { CpcBillingTransition } from "./reconcile";

export async function upsertBillingState(transition: CpcBillingTransition) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("cpc_billing_state")
    .upsert(
      {
        client_id: transition.clientId,
        provider: "stripe",
        stripe_customer_id: transition.stripeCustomerId,
        stripe_subscription_id: transition.stripeSubscriptionId,
        stripe_price_id: transition.stripePriceId,
        status: transition.status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider,stripe_customer_id" },
    )
    .select("id, client_id, status, stripe_subscription_id, stripe_price_id")
    .single();

  if (error) throw error;
  return data;
}
