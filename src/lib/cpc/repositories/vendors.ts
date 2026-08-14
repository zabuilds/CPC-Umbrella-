import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Db = SupabaseClient<Database>;
type VendorInsert = Database["public"]["Tables"]["vendors"]["Insert"];
type VendorUpdate = Database["public"]["Tables"]["vendors"]["Update"];

export async function listVendors(db: Db) {
  return db.from("vendors").select("*").order("name", { ascending: true });
}

export async function getVendor(db: Db, id: string) {
  return db.from("vendors").select("*").eq("id", id).maybeSingle();
}

export async function createVendor(db: Db, input: VendorInsert) {
  return db.from("vendors").insert(input).select("*").single();
}

export async function updateVendor(db: Db, id: string, input: VendorUpdate) {
  return db.from("vendors").update(input).eq("id", id).select("*").single();
}
