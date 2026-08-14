import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];

type Db = SupabaseClient<Database>;

export async function listClients(db: Db) {
  return db.from("clients").select("*").order("display_name", { ascending: true });
}

export async function getClient(db: Db, id: string) {
  return db.from("clients").select("*").eq("id", id).maybeSingle();
}

export async function createClientRecord(db: Db, input: ClientInsert) {
  return db.from("clients").insert(input).select("*").single();
}

export type Client = ClientRow;
