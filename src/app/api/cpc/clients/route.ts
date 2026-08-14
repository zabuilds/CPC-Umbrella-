import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/lib/cpc/repositories/clients";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: "authentication_check_failed" }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await listClients(supabase);

  if (error) {
    return NextResponse.json({ error: "client_query_failed" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
