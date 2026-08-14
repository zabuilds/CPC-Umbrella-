import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

type IssueRow = Database["public"]["Tables"]["issues"]["Row"];
type IssueInsert = Database["public"]["Tables"]["issues"]["Insert"];
type Db = SupabaseClient<Database>;

export async function listPropertyIssues(db: Db, propertyId: string) {
  return db
    .from("issues")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });
}

export async function listOpenIssues(db: Db) {
  return db
    .from("issues")
    .select("*")
    .in("status", ["open", "in_progress"])
    .order("severity", { ascending: true })
    .order("created_at", { ascending: false });
}

export async function createIssue(db: Db, input: IssueInsert) {
  return db.from("issues").insert(input).select("*").single();
}

export type Issue = IssueRow;
