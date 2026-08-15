import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

const BUCKET = "cpc-evidence";

type Client = SupabaseClient<Database>;

function propertyPrefix(propertyId: string) {
  return `properties/${propertyId}`;
}

export function evidenceStoragePath(propertyId: string, inspectionId: string, evidenceId: string, filename: string) {
  if (!propertyId || !inspectionId || !evidenceId) throw new Error("Evidence storage identifiers are required");
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${propertyPrefix(propertyId)}/inspections/${inspectionId}/evidence/${evidenceId}/${safeName}`;
}

export function assertEvidenceStoragePath(path: string, propertyId: string, inspectionId: string, evidenceId: string) {
  const prefix = `${propertyPrefix(propertyId)}/inspections/${inspectionId}/evidence/${evidenceId}/`;
  if (!path.startsWith(prefix)) throw new Error("Evidence storage path does not match its CPC ownership context");
}

export async function createEvidenceUploadUrl(
  client: Client,
  propertyId: string,
  inspectionId: string,
  evidenceId: string,
  filename: string,
) {
  const path = evidenceStoragePath(propertyId, inspectionId, evidenceId, filename);
  return client.storage.from(BUCKET).createSignedUploadUrl(path);
}

export async function createEvidenceDownloadUrl(
  client: Client,
  storagePath: string,
  propertyId: string,
  inspectionId: string,
  evidenceId: string,
  expiresInSeconds = 300,
) {
  assertEvidenceStoragePath(storagePath, propertyId, inspectionId, evidenceId);
  return client.storage.from(BUCKET).createSignedUrl(storagePath, expiresInSeconds);
}
