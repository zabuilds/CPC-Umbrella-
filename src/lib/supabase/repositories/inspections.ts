import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

type Client = SupabaseClient<Database>;
type InspectionInsert = Database["public"]["Tables"]["inspections"]["Insert"];
type InspectionUpdate = Database["public"]["Tables"]["inspections"]["Update"];

export async function listInspections(client: Client, propertyId?: string) {
  let query = client.from("inspections").select("*").order("scheduled_for", { ascending: false });
  if (propertyId) query = query.eq("property_id", propertyId);
  return query;
}

export async function getInspection(client: Client, inspectionId: string) {
  return client.from("inspections").select("*").eq("id", inspectionId).maybeSingle();
}

export async function createInspection(client: Client, input: InspectionInsert) {
  return client.from("inspections").insert(input).select("*").single();
}

export async function updateInspection(client: Client, inspectionId: string, input: InspectionUpdate) {
  return client.from("inspections").update(input).eq("id", inspectionId).select("*").single();
}
