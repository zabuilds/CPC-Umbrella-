import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { listProperties } from "@/lib/cpc/repositories/properties";
import { listPropertyInspections } from "@/lib/cpc/repositories/inspections";

export default async function InspectionsPage() {
  const supabase = await createClient();
  const { data: properties, error: propertiesError } = await listProperties(supabase);
  if (propertiesError) throw new Error("Unable to load inspection properties");

  const activity = await Promise.all((properties ?? []).map(async (property) => {
    const { data, error } = await listPropertyInspections(supabase, property.id);
    if (error) throw new Error("Unable to load inspections");
    return { property, inspections: data ?? [] };
  }));

  const inspections = activity.flatMap(({ property, inspections: rows }) =>
    rows.map((inspection) => ({ property, inspection })),
  );

  return (
    <section aria-labelledby="inspections-heading">
      <header><p>Cayman Property Check</p><h1 id="inspections-heading">Inspections</h1><p>Review inspection activity across the property portfolio.</p></header>
      {inspections.length === 0 ? <p>No inspections are currently recorded.</p> : (
        <ul>
          {inspections.map(({ property, inspection }) => (
            <li key={inspection.id}>
              <Link href={`/dashboard/properties/${property.id}`}><strong>{property.name}</strong></Link>
              <span> · {String(inspection.status)} · {inspection.scheduled_for}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
