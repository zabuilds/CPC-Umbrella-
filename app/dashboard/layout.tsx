import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const navigation = [
  ["Dashboard", "/dashboard"],
  ["Properties", "/dashboard/properties"],
  ["Inspections", "/dashboard/inspections"],
  ["Issues", "/dashboard/issues"],
  ["Clients", "/dashboard/clients"],
  ["Vendors", "/dashboard/vendors"],
  ["Reports", "/dashboard/reports"],
] as const;

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <div>
      <aside aria-label="CPC navigation">
        <strong>Cayman Property Check</strong>
        <nav>
          <ul>
            {navigation.map(([label, href]) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
