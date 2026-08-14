import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

type Client = SupabaseClient<Database>;
type IssueInsert = Database["public"]["Tables"]["issues"]["Insert"];
type IssueUpdate = Database["public"]["Tables"]["issues"]["Update"];

export async function listIssues(client: Client, propertyId?: string) {
  let query = client.from("issues").select("*").order("created_at", { ascending: false });
  if (propertyId) query = query.eq("property_id", propertyId);
  return query;
}

export async function getIssue(client: Client, issueId: string) {
  return client.from("issues").select("*").eq("id", issueId).maybeSingle();
}

export async function createIssue(client: Client, input: IssueInsert) {
  return client.from("issues").insert(input).select("*").single();
}

export async function updateIssue(client: Client, issueId: string, input: IssueUpdate) {
  return client.from("issues").update(input).eq("id", issueId).select("*").single();
}
