import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { listProperties } from "@/lib/cpc/repositories/properties";

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

  const { data, error } = await listProperties(supabase);

  if (error) {
    return NextResponse.json({ error: "property_query_failed" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
