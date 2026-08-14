import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { listProperties } from "@/lib/cpc/repositories/properties";
import { listPropertyInspections } from "@/lib/cpc/repositories/inspections";
import { getInspectionReport } from "@/lib/cpc/repositories/inspection-reports";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: properties, error: propertiesError } = await listProperties(supabase);

  if (propertiesError) throw new Error("Unable to load report properties");

  const activity = await Promise.all(
    (properties ?? []).map(async (property) => {
      const { data: inspections, error } = await listPropertyInspections(supabase, property.id);
      if (error) throw new Error("Unable to load report inspections");

      const reports = await Promise.all(
        (inspections ?? []).map(async (inspection) => {
          const { data, error: reportError } = await getInspectionReport(supabase, inspection.id);
          if (reportError) throw new Error("Unable to load inspection report");
          return { inspection, report: data };
        }),
      );

      return { property, reports };
    }),
  );

  const reports = activity.flatMap(({ property, reports: rows }) =>
    rows.map(({ inspection, report }) => ({ property, inspection, report })),
  );

  return (
    <section aria-labelledby="reports-heading">
      <header>
        <p>Cayman Property Check</p>
        <h1 id="reports-heading">Reports</h1>
        <p>Review inspection reports across the property portfolio.</p>
      </header>

      {reports.length === 0 ? (
        <p>No inspection reports are currently recorded.</p>
      ) : (
        <ul>
          {reports.map(({ property, inspection, report }) => (
            <li key={inspection.id}>
              <Link href={`/dashboard/properties/${property.id}`}>
                <strong>{property.name}</strong>
              </Link>
              <span> · {report ? "Report available" : "Report pending"} · {String(inspection.status)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
