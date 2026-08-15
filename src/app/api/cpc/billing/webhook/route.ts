import { NextRequest, NextResponse } from "next/server";

import { constructStripeWebhookEvent, mapStripeWebhookEvent } from "@/lib/cpc/billing/stripe-adapter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const event = constructStripeWebhookEvent(payload, signature);
    const mapped = mapStripeWebhookEvent(event);

    // Persistence is intentionally kept behind the billing repository boundary.
    // Until that repository is wired to a dedicated billing-events table, this route
    // verifies and maps the event but performs no billing state mutation.
    return NextResponse.json({
      received: true,
      eventId: mapped.envelope.providerEventId,
      idempotencyKey: mapped.idempotencyKey,
    });
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook" }, { status: 400 });
  }
}
