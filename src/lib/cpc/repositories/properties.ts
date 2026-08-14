import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type Db = SupabaseClient<Database>;

export async function listProperties(db: Db) {
  return db.from("properties").select("*").order("name", { ascending: true });
}

export async function getProperty(db: Db, id: string) {
  return db.from("properties").select("*").eq("id", id).maybeSingle();
}

export async function listClientProperties(db: Db, clientId: string) {
  return db.from("properties").select("*").eq("client_id", clientId).order("name");
}

export async function createProperty(db: Db, input: PropertyInsert) {
  return db.from("properties").insert(input).select("*").single();
}

export type Property = PropertyRow;
