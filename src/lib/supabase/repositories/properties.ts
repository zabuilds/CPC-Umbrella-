import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

type Client = SupabaseClient<Database>;
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export async function listProperties(client: Client) {
  return client
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function getProperty(client: Client, propertyId: string) {
  return client.from("properties").select("*").eq("id", propertyId).maybeSingle();
}

export async function createProperty(client: Client, input: PropertyInsert) {
  return client.from("properties").insert(input).select("*").single();
}

export async function updateProperty(
  client: Client,
  propertyId: string,
  input: PropertyUpdate,
) {
  return client
    .from("properties")
    .update(input)
    .eq("id", propertyId)
    .select("*")
    .single();
}
