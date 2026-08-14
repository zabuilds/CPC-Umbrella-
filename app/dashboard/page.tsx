import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/lib/cpc/repositories/clients";
import { listProperties } from "@/lib/cpc/repositories/properties";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [{ data: clients, error: clientsError }, { data: properties, error: propertiesError }] =
    await Promise.all([listClients(supabase), listProperties(supabase)]);

  if (clientsError || propertiesError) {
    throw new Error("Unable to load dashboard data");
  }

  return (
    <main>
      <header>
        <p>Cayman Property Check</p>
        <h1>Property oversight dashboard</h1>
        <p>Protecting what you own.</p>
      </header>

      <section aria-label="Portfolio summary">
        <article>
          <h2>{properties?.length ?? 0}</h2>
          <p>Properties</p>
        </article>
        <article>
          <h2>{clients?.length ?? 0}</h2>
          <p>Clients</p>
        </article>
      </section>
    </main>
  );
}
