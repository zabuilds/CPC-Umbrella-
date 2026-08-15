import { NextRequest, NextResponse } from "next/server";

import { handleStripeBillingEvent } from "@/lib/cpc/billing/event-handlers";
import {
  claimBillingEvent,
  markBillingEventFailed,
  markBillingEventProcessed,
} from "@/lib/cpc/billing/event-repository";
import { upsertBillingState } from "@/lib/cpc/billing/state-repository";
import { constructStripeWebhookEvent, mapStripeWebhookEvent } from "@/lib/cpc/billing/stripe-adapter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event;

  try {
    event = constructStripeWebhookEvent(payload, signature);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook" }, { status: 400 });
  }

  const mapped = mapStripeWebhookEvent(event);

  let claim;
  try {
    claim = await claimBillingEvent({
      providerEventId: mapped.envelope.providerEventId,
      eventType: mapped.envelope.eventType,
      idempotencyKey: mapped.idempotencyKey,
    });
  } catch {
    return NextResponse.json({ error: "Billing event persistence unavailable" }, { status: 500 });
  }

  if (!claim.claimed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (!claim.event?.id) {
    return NextResponse.json({ error: "Billing event claim failed" }, { status: 500 });
  }

  try {
    const result = handleStripeBillingEvent(event);

    if (result.kind === "subscription") {
      await upsertBillingState(result.transition);
    }

    await markBillingEventProcessed(claim.event.id);
    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    try {
      await markBillingEventFailed(
        claim.event.id,
        error instanceof Error ? error.message : "Billing event processing failed",
      );
    } catch {
      // Preserve the 5xx response so the provider can retry the event.
    }
    return NextResponse.json({ error: "Billing event processing failed" }, { status: 500 });
  }
}
