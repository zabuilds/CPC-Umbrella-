import type { CpcBillingEvent } from "./contracts";

export type BillingEventClaim = {
  provider: "stripe";
  providerEventId: string;
  eventType: CpcBillingEvent;
  receivedAt: string;
};

export type BillingEventClaimResult =
  | { accepted: true; claim: BillingEventClaim }
  | { accepted: false; reason: "duplicate" };

/**
 * Pure idempotency boundary. Persistence is intentionally injected so the
 * billing domain never depends directly on a database implementation.
 */
export function createBillingEventClaim(
  input: BillingEventClaim,
  hasBeenProcessed: (providerEventId: string) => boolean,
): BillingEventClaimResult {
  if (hasBeenProcessed(input.providerEventId)) {
    return { accepted: false, reason: "duplicate" };
  }

  return { accepted: true, claim: input };
}
