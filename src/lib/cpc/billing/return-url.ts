import "server-only";

/**
 * Billing return URLs are validated as application-owned HTTPS URLs.
 * This prevents checkout/portal flows from becoming open redirects while
 * leaving the final CPC domain configurable for each deployment.
 */
export function requireBillingReturnUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid billing return URL");
  }

  if (url.protocol !== "https:") {
    throw new Error("Billing return URL must use HTTPS");
  }

  if (url.username || url.password) {
    throw new Error("Billing return URL cannot contain credentials");
  }

  return url.toString();
}
