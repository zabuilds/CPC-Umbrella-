import { NextRequest, NextResponse } from "next/server";

import { constructStripeWebhookEvent, mapStripeWebhookEvent } from "@/lib/cpc/billing/stripe-adapter";
import {
  claimBillingEvent,
  markBillingEventFailed,
  markBillingEventProcessed,
} from "@/lib/cpc/billing/event-repository";

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
    const claim = await claimBillingEvent({
      providerEventId: mapped.envelope.providerEventId,
      eventType: mapped.envelope.eventType,
      idempotencyKey: mapped.idempotencyKey,
    });

    if (!claim.claimed) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (!claim.event?.id) {
      return NextResponse.json({ error: "Billing event claim failed" }, { status: 500 });
    }

    try {
      // State reconciliation is intentionally isolated until provider-event handlers
      // are added for each authoritative CPC billing transition.
      await markBillingEventProcessed(claim.event.id);
    } catch (error) {
      await markBillingEventFailed(
        claim.event.id,
        error instanceof Error ? error.message : "Billing event processing failed",
      );
      throw error;
    }

    return NextResponse.json({ received: true, eventId: event.id });
  } catch {
    return NextResponse.json({ error: "Invalid or unprocessable Stripe webhook" }, { status: 400 });
  }
}
