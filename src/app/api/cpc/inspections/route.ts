import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { listPropertyInspections } from "@/lib/cpc/repositories/inspections";

export async function GET(request: Request) {
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

  const propertyId = new URL(request.url).searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId_required" }, { status: 400 });
  }

  const { data, error } = await listPropertyInspections(supabase, propertyId);
  if (error) {
    return NextResponse.json({ error: "inspection_query_failed" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
