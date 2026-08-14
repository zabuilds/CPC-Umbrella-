import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/lib/cpc/repositories/clients";
import { listProperties } from "@/lib/cpc/repositories/properties";

export default async function ClientsPage() {
  const supabase = await createClient();
  const [{ data: clients, error: clientsError }, { data: properties, error: propertiesError }] =
    await Promise.all([listClients(supabase), listProperties(supabase)]);

  if (clientsError || propertiesError) throw new Error("Unable to load clients");

  const propertyCountByClient = new Map<string, number>();
  for (const property of properties ?? []) {
    if (property.client_id) {
      propertyCountByClient.set(property.client_id, (propertyCountByClient.get(property.client_id) ?? 0) + 1);
    }
  }

  return (
    <section aria-labelledby="clients-heading">
      <header>
        <p>Cayman Property Check</p>
        <h1 id="clients-heading">Clients</h1>
        <p>Manage the owners and client relationships behind the portfolio.</p>
      </header>
      {(clients ?? []).length === 0 ? <p>No clients are currently recorded.</p> : (
        <ul>
          {(clients ?? []).map((client) => (
            <li key={client.id}>
              <Link href={`/dashboard/clients/${client.id}`}>
                <strong>{client.display_name ?? client.legal_name}</strong>
              </Link>
              <span> · {propertyCountByClient.get(client.id) ?? 0} properties</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
