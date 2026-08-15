import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedCpcClient } from "@/lib/cpc/billing/client-authorization";
import { createCpcCheckoutSession } from "@/lib/cpc/billing/session-boundary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuthenticatedCpcClient();
    const body = await request.json();

    if (typeof body.priceId !== "string" || typeof body.successUrl !== "string" || typeof body.cancelUrl !== "string") {
      return NextResponse.json({ error: "Invalid billing request" }, { status: 400 });
    }

    const session = await createCpcCheckoutSession({
      clientId: client.id,
      priceId: body.priceId,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Billing request failed";
    const status = message === "Authentication required" ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}
