import { NextResponse } from "next/server";

import { requireAuthenticatedCpcClient } from "@/lib/cpc/billing/client-authorization";
import { createCpcCustomerPortalSession } from "@/lib/cpc/billing/session-boundary";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST() {
  try {
    const { client } = await requireAuthenticatedCpcClient();
    const admin = getSupabaseAdminClient();
    const { data: billing, error } = await admin
      .from("cpc_billing_state")
      .select("stripe_customer_id")
      .eq("client_id", client.id)
      .maybeSingle();

    if (error) throw error;
    if (!billing?.stripe_customer_id) {
      return NextResponse.json({ error: "No active Stripe customer is linked to this CPC client" }, { status: 404 });
    }

    const returnUrl = new URL("/account/billing", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").toString();
    const session = await createCpcCustomerPortalSession({
      clientId: client.id,
      customerId: billing.stripe_customer_id,
      returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Billing request failed";
    const status = message === "Authentication required" ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}
