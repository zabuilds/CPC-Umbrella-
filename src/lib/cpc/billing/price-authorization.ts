import "server-only";

/**
 * Pricing remains intentionally configurable.
 * This boundary validates that a price identifier exists and that billing
 * cannot proceed with an empty identifier, without declaring CPC pricing final.
 */
export function requireBillingPriceId(priceId: string) {
  if (!priceId || !priceId.trim()) {
    throw new Error("Billing price selection is required");
  }
  return priceId.trim();
}
