import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { listProperties } from "@/lib/cpc/repositories/properties";
import { listPropertyIssues } from "@/lib/cpc/repositories/issues";

export default async function IssuesPage() {
  const supabase = await createClient();
  const { data: properties, error: propertiesError } = await listProperties(supabase);

  if (propertiesError) throw new Error("Unable to load issue properties");

  const activity = await Promise.all(
    (properties ?? []).map(async (property) => {
      const { data, error } = await listPropertyIssues(supabase, property.id);
      if (error) throw new Error("Unable to load issues");
      return { property, issues: data ?? [] };
    }),
  );

  const issues = activity.flatMap(({ property, issues: rows }) =>
    rows.map((issue) => ({ property, issue })),
  );

  return (
    <section aria-labelledby="issues-heading">
      <header>
        <p>Cayman Property Check</p>
        <h1 id="issues-heading">Issues</h1>
        <p>Track property issues from discovery through resolution.</p>
      </header>

      {issues.length === 0 ? (
        <p>No issues are currently recorded.</p>
      ) : (
        <ul>
          {issues.map(({ property, issue }) => (
            <li key={issue.id}>
              <Link href={`/dashboard/properties/${property.id}`}>
                <strong>{property.name}</strong>
              </Link>
              <span> · {String(issue.severity)} · {String(issue.status)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
