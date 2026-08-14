import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export async function listClients(client: Client) {
  return client.from("clients").select("*").order("created_at", { ascending: false });
}

export async function getClient(client: Client, clientId: string) {
  return client.from("clients").select("*").eq("id", clientId).maybeSingle();
}

export async function createClient(client: Client, input: ClientInsert) {
  return client.from("clients").insert(input).select("*").single();
}

export async function updateClient(client: Client, clientId: string, input: ClientUpdate) {
  return client.from("clients").update(input).eq("id", clientId).select("*").single();
}
