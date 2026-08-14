import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getInspectionReport } from "@/lib/cpc/repositories/inspection-reports";

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

  const inspectionId = new URL(request.url).searchParams.get("inspectionId");
  if (!inspectionId) {
    return NextResponse.json({ error: "inspectionId_required" }, { status: 400 });
  }

  const { data, error } = await getInspectionReport(supabase, inspectionId);
  if (error) {
    return NextResponse.json({ error: "inspection_report_query_failed" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
