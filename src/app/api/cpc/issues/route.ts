import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { listPropertyIssues } from "@/lib/cpc/repositories/issues";

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

  const { data, error } = await listPropertyIssues(supabase, propertyId);
  if (error) {
    return NextResponse.json({ error: "issue_query_failed" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
