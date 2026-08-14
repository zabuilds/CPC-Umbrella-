import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProperty } from "@/lib/cpc/repositories/properties";
import { listPropertyInspections } from "@/lib/cpc/repositories/inspections";
import { listPropertyIssues } from "@/lib/cpc/repositories/issues";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: property, error: propertyError } = await getProperty(supabase, id);
  if (propertyError) throw new Error("Unable to load property");
  if (!property) notFound();
  const [inspectionsResult, issuesResult] = await Promise.all([listPropertyInspections(supabase, id), listPropertyIssues(supabase, id)]);
  if (inspectionsResult.error || issuesResult.error) throw new Error("Unable to load property activity");
  const inspections = inspectionsResult.data ?? [];
  const issues = issuesResult.data ?? [];
  const openIssues = issues.filter((issue) => issue.status !== "resolved");
  return (
    <section aria-labelledby="property-heading"><Link href="/dashboard/properties">← Properties</Link>
      <header><p>Property</p><h1 id="property-heading">{property.name}</h1><p>{property.address_line_1}</p></header>
      <section aria-label="Property summary"><article><h2>{inspections.length}</h2><p>Inspections</p></article><article><h2>{openIssues.length}</h2><p>Open issues</p></article><article><h2>{issues.length}</h2><p>Total issues</p></article></section>
      <section aria-labelledby="inspection-heading"><h2 id="inspection-heading">Inspection history</h2>{inspections.length === 0 ? <p>No inspections recorded.</p> : <ul>{inspections.map((inspection) => <li key={inspection.id}><strong>{String(inspection.status)}</strong><span> · {inspection.scheduled_for}</span></li>)}</ul>}</section>
      <section aria-labelledby="issues-heading"><h2 id="issues-heading">Issues</h2>{issues.length === 0 ? <p>No issues recorded.</p> : <ul>{issues.map((issue) => <li key={issue.id}><strong>{String(issue.status)}</strong><span> · {String(issue.severity)}</span></li>)}</ul>}</section>
    </section>
  );
}
