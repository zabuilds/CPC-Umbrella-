import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Db = SupabaseClient<Database>;
type ReportInsert = Database["public"]["Tables"]["inspection_reports"]["Insert"];
type ReportUpdate = Database["public"]["Tables"]["inspection_reports"]["Update"];

export async function getInspectionReport(db: Db, inspectionId: string) {
  return db
    .from("inspection_reports")
    .select("*")
    .eq("inspection_id", inspectionId)
    .maybeSingle();
}

export async function createInspectionReport(db: Db, input: ReportInsert) {
  return db.from("inspection_reports").insert(input).select("*").single();
}

export async function updateInspectionReport(
  db: Db,
  id: string,
  input: ReportUpdate,
) {
  return db.from("inspection_reports").update(input).eq("id", id).select("*").single();
}
