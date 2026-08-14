import type { AppRole } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return { user: null, profile: null, error };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile, error: profileError };
}

export async function requireRole(roles: AppRole[]) {
  const context = await getCurrentUserContext();
  if (!context.user || !context.profile || !roles.includes(context.profile.role)) {
    throw new Error("FORBIDDEN");
  }
  return context;
}
