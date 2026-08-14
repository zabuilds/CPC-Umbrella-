import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getClient } from "@/lib/cpc/repositories/clients";
import { listProperties } from "@/lib/cpc/repositories/properties";
import { listPropertyInspections } from "@/lib/cpc/repositories/inspections";
import { listPropertyIssues } from "@/lib/cpc/repositories/issues";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client, error: clientError } = await getClient(supabase, id);
  if (clientError) throw new Error("Unable to load client");
  if (!client) notFound();

  const { data: properties, error: propertiesError } = await listProperties(supabase);
  if (propertiesError) throw new Error("Unable to load client properties");

  const clientProperties = (properties ?? []).filter((property) => property.client_id === id);
  const activity = await Promise.all(
    clientProperties.map(async (property) => {
      const [{ data: inspections, error: inspectionsError }, { data: issues, error: issuesError }] =
        await Promise.all([
          listPropertyInspections(supabase, property.id),
          listPropertyIssues(supabase, property.id),
        ]);

      if (inspectionsError || issuesError) throw new Error("Unable to load client activity");
      return { property, inspections: inspections ?? [], issues: issues ?? [] };
    }),
  );

  const inspectionCount = activity.reduce((sum, item) => sum + item.inspections.length, 0);
  const openIssueCount = activity.reduce(
    (sum, item) => sum + item.issues.filter((issue) => issue.status !== "resolved").length,
    0,
  );

  return (
    <section aria-labelledby="client-heading">
      <Link href="/dashboard/clients">← Clients</Link>
      <header>
        <p>Client</p>
        <h1 id="client-heading">{client.display_name ?? client.legal_name}</h1>
        <p>{client.email ?? "Email not recorded"}</p>
      </header>

      <section aria-label="Client summary">
        <article><h2>{clientProperties.length}</h2><p>Properties</p></article>
        <article><h2>{inspectionCount}</h2><p>Inspections</p></article>
        <article><h2>{openIssueCount}</h2><p>Open issues</p></article>
      </section>

      <section aria-labelledby="portfolio-heading">
        <h2 id="portfolio-heading">Property portfolio</h2>
        {activity.length === 0 ? (
          <p>No properties are currently assigned to this client.</p>
        ) : (
          <ul>
            {activity.map(({ property, inspections, issues }) => (
              <li key={property.id}>
                <Link href={`/dashboard/properties/${property.id}`}>
                  <strong>{property.name}</strong>
                </Link>
                <span> · {inspections.length} inspections · {issues.length} issues</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
