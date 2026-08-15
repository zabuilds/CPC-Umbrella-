import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";
import type { EvidencePersistenceRow } from "@/lib/cpc/operations/evidence-persistence";
import { evidenceStoragePath } from "../storage/evidence";

type Client = SupabaseClient<Database>;
type EvidenceInsert = Database["public"]["Tables"]["evidence_metadata"]["Insert"];
type EvidenceUpdate = Database["public"]["Tables"]["evidence_metadata"]["Update"];

function validateStoragePath(row: EvidencePersistenceRow) {
  const expected = evidenceStoragePath(row.property_id, row.inspection_id, row.id, row.filename);
  if (row.storage_path !== expected) {
    throw new Error("Evidence storage path does not match the evidence ownership context");
  }
}

export async function listEvidence(client: Client, inspectionId?: string) {
  let query = client.from("evidence_metadata").select("*").order("created_at", { ascending: false });
  if (inspectionId) query = query.eq("inspection_id", inspectionId);
  return query;
}

export async function getEvidence(client: Client, evidenceId: string) {
  return client.from("evidence_metadata").select("*").eq("id", evidenceId).maybeSingle();
}

export async function createEvidence(client: Client, row: EvidencePersistenceRow) {
  validateStoragePath(row);
  const input: EvidenceInsert = row;
  return client.from("evidence_metadata").insert(input).select("*").single();
}

export async function updateEvidence(client: Client, evidenceId: string, row: EvidencePersistenceRow) {
  if (row.id !== evidenceId) throw new Error("Evidence id does not match the update target");
  validateStoragePath(row);
  const input: EvidenceUpdate = row;
  return client.from("evidence_metadata").update(input).eq("id", evidenceId).select("*").single();
}

export async function deleteEvidence(client: Client, evidenceId: string) {
  return client.from("evidence_metadata").delete().eq("id", evidenceId);
}
