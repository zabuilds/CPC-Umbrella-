import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

type InspectionRow = Database["public"]["Tables"]["inspections"]["Row"];
type InspectionInsert = Database["public"]["Tables"]["inspections"]["Insert"];
type Db = SupabaseClient<Database>;

export async function listPropertyInspections(db: Db, propertyId: string) {
  return db
    .from("inspections")
    .select("*")
    .eq("property_id", propertyId)
    .order("scheduled_for", { ascending: false });
}

export async function getInspection(db: Db, id: string) {
  return db.from("inspections").select("*").eq("id", id).maybeSingle();
}

export async function createInspection(db: Db, input: InspectionInsert) {
  return db.from("inspections").insert(input).select("*").single();
}

export type Inspection = InspectionRow;
