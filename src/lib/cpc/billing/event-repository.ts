import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type BillingEventStatus = "received" | "processed" | "failed";

export async function claimBillingEvent(input: {
  providerEventId: string;
  eventType: string;
  idempotencyKey: string;
}) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("cpc_billing_events")
    .insert({
      provider: "stripe",
      provider_event_id: input.providerEventId,
      event_type: input.eventType,
      idempotency_key: input.idempotencyKey,
    })
    .select("id, status")
    .maybeSingle();

  if (!error) return { claimed: true, event: data };

  if (error.code === "23505") {
    return { claimed: false, event: null };
  }

  throw error;
}

export async function markBillingEventProcessed(eventId: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("cpc_billing_events")
    .update({ status: "processed", processed_at: new Date().toISOString(), error_message: null })
    .eq("id", eventId);
  if (error) throw error;
}

export async function markBillingEventFailed(eventId: string, errorMessage: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("cpc_billing_events")
    .update({ status: "failed", error_message: errorMessage.slice(0, 2000) })
    .eq("id", eventId);
  if (error) throw error;
}
