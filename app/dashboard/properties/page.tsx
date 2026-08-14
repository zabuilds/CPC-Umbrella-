import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { listProperties } from "@/lib/cpc/repositories/properties";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data, error } = await listProperties(supabase);

  if (error) throw new Error("Unable to load properties");

  const properties = data ?? [];

  return (
    <section aria-labelledby="properties-heading">
      <header>
        <p>Cayman Property Check</p>
        <h1 id="properties-heading">Properties</h1>
        <p>Monitor every property from one operational workspace.</p>
      </header>

      {properties.length === 0 ? (
        <p>No properties are currently available.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <Link href={`/dashboard/properties/${property.id}`}>
                <strong>{property.name}</strong>
              </Link>
              <span>{property.address ?? "Address not recorded"}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
