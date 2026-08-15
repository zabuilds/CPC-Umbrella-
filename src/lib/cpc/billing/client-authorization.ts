import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function requireAuthenticatedCpcClient() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Authentication required");

  const admin = getSupabaseAdminClient();
  const { data: client, error } = await admin
    .from("clients")
    .select("id, email, profile_id, status")
    .eq("profile_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  if (!client) throw new Error("CPC client account not found");

  return { user, client };
}
