import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";
import type { EvidencePersistenceRow } from "@/lib/cpc/operations/evidence-persistence";

type Client = SupabaseClient<Database>;
type EvidenceInsert = Database["public"]["Tables"]["evidence_metadata"]["Insert"];
type EvidenceUpdate = Database["public"]["Tables"]["evidence_metadata"]["Update"];

export async function listEvidence(client: Client, inspectionId?: string) {
  let query = client.from("evidence_metadata").select("*").order("created_at", { ascending: false });
  if (inspectionId) query = query.eq("inspection_id", inspectionId);
  return query;
}

export async function getEvidence(client: Client, evidenceId: string) {
  return client.from("evidence_metadata").select("*").eq("id", evidenceId).maybeSingle();
}

export async function createEvidence(client: Client, row: EvidencePersistenceRow) {
  const input: EvidenceInsert = row;
  return client.from("evidence_metadata").insert(input).select("*").single();
}

export async function updateEvidence(client: Client, evidenceId: string, row: EvidencePersistenceRow) {
  const input: EvidenceUpdate = row;
  return client.from("evidence_metadata").update(input).eq("id", evidenceId).select("*").single();
}

export async function deleteEvidence(client: Client, evidenceId: string) {
  return client.from("evidence_metadata").delete().eq("id", evidenceId);
}
