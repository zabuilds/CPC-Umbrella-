import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/lib/cpc/repositories/clients";
import { listProperties } from "@/lib/cpc/repositories/properties";
import { listPropertyIssues } from "@/lib/cpc/repositories/issues";
import { listPropertyInspections } from "@/lib/cpc/repositories/inspections";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [clientsResult, propertiesResult] = await Promise.all([
    listClients(supabase),
    listProperties(supabase),
  ]);

  if (clientsResult.error || propertiesResult.error) {
    throw new Error("Unable to load dashboard data");
  }

  const properties = propertiesResult.data ?? [];
  const propertyActivity = await Promise.all(
    properties.map(async (property) => {
      const [{ data: inspections, error: inspectionsError }, { data: issues, error: issuesError }] =
        await Promise.all([
          listPropertyInspections(supabase, property.id),
          listPropertyIssues(supabase, property.id),
        ]);

      if (inspectionsError || issuesError) {
        throw new Error("Unable to load property activity");
      }

      return {
        property,
        inspections: inspections ?? [],
        issues: issues ?? [],
      };
    }),
  );

  const inspectionCount = propertyActivity.reduce((total, item) => total + item.inspections.length, 0);
  const openIssueCount = propertyActivity.reduce(
    (total, item) => total + item.issues.filter((issue) => issue.status !== "resolved" && issue.status !== "closed").length,
    0,
  );

  return (
    <main>
      <header>
        <p>Cayman Property Check</p>
        <h1>Property oversight dashboard</h1>
        <p>Protecting what you own.</p>
      </header>

      <section aria-label="Portfolio summary">
        <article><h2>{properties.length}</h2><p>Properties</p></article>
        <article><h2>{clientsResult.data?.length ?? 0}</h2><p>Clients</p></article>
        <article><h2>{inspectionCount}</h2><p>Inspections</p></article>
        <article><h2>{openIssueCount}</h2><p>Open issues</p></article>
      </section>

      <section aria-label="Properties">
        <h2>Properties</h2>
        {propertyActivity.length === 0 ? (
          <p>No properties are currently available.</p>
        ) : (
          <ul>
            {propertyActivity.map(({ property, inspections, issues }) => (
              <li key={property.id}>
                <strong>{property.name}</strong>
                <span> · {inspections.length} inspections · {issues.length} issues</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
