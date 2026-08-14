import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { listVendors } from "@/lib/cpc/repositories/vendors";

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

  const { data, error } = await listVendors(supabase);
  if (error) {
    return NextResponse.json({ error: "vendor_query_failed" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
