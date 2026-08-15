import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

const BUCKET = "cpc-evidence";

type Client = SupabaseClient<Database>;

function propertyPrefix(propertyId: string) {
  return `properties/${propertyId}`;
}

export function evidenceStoragePath(propertyId: string, inspectionId: string, evidenceId: string, filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${propertyPrefix(propertyId)}/inspections/${inspectionId}/evidence/${evidenceId}/${safeName}`;
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

export async function createEvidenceDownloadUrl(client: Client, storagePath: string, expiresInSeconds = 300) {
  return client.storage.from(BUCKET).createSignedUrl(storagePath, expiresInSeconds);
}
