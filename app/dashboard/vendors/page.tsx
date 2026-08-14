import { createClient } from "@/lib/supabase/server";
import { listVendors } from "@/lib/cpc/repositories/vendors";

export default async function VendorsPage() {
  const supabase = await createClient();
  const { data, error } = await listVendors(supabase);
  if (error) throw new Error("Unable to load vendors");
  const vendors = data ?? [];
  return (
    <section aria-labelledby="vendors-heading"><header><p>Cayman Property Check</p><h1 id="vendors-heading">Vendors</h1><p>Maintain the trusted service-provider network supporting the property portfolio.</p></header>
      {vendors.length === 0 ? <p>No vendors are currently recorded.</p> : <ul>{vendors.map((vendor) => <li key={vendor.id}><strong>{vendor.business_name}</strong><span> · {vendor.trade ?? "Trade not recorded"}</span></li>)}</ul>}
    </section>
  );
}
