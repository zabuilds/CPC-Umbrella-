import type { Database } from "./types";

/**
 * CPC application contracts that intentionally extend the live Supabase schema.
 *
 * Keep this separate from Database so generated/live-schema typing can remain
 * authoritative while forward-looking application contracts (such as billing
 * state) can evolve independently until their migrations are deployed.
 */
export type AppDatabase = Database & {
  public: {
    Tables: Database["public"]["Tables"] & {
      cpc_billing_state: {
        Row: {
          id: string;
          client_id: string;
          provider: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          provider: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          provider?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cpc_billing_state_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
    };
  };
};
