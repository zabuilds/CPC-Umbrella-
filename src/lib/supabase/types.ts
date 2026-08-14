export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; role: "owner" | "admin" | "operations" | "inspector" | "vendor"; full_name: string | null; phone: string | null; created_at: string; updated_at: string };
        Insert: { id: string; role?: "owner" | "admin" | "operations" | "inspector" | "vendor"; full_name?: string | null; phone?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; role?: "owner" | "admin" | "operations" | "inspector" | "vendor"; full_name?: string | null; phone?: string | null; created_at?: string; updated_at?: string };
      };
      clients: {
        Row: { id: string; profile_id: string | null; legal_name: string; display_name: string | null; email: string | null; phone: string | null; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; profile_id?: string | null; legal_name: string; display_name?: string | null; email?: string | null; phone?: string | null; status?: string; created_at?: string; updated_at?: string };
        Update: { id?: string; profile_id?: string | null; legal_name?: string; display_name?: string | null; email?: string | null; phone?: string | null; status?: string; created_at?: string; updated_at?: string };
      };
      properties: {
        Row: { id: string; client_id: string; name: string; address_line_1: string; address_line_2: string | null; city: string | null; postal_code: string | null; island: string; status: "active" | "inactive" | "archived"; access_notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; client_id: string; name: string; address_line_1: string; address_line_2?: string | null; city?: string | null; postal_code?: string | null; island?: string; status?: "active" | "inactive" | "archived"; access_notes?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; client_id?: string; name?: string; address_line_1?: string; address_line_2?: string | null; city?: string | null; postal_code?: string | null; island?: string; status?: "active" | "inactive" | "archived"; access_notes?: string | null; created_at?: string; updated_at?: string };
      };
      vendors: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      inspections: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      issues: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      inspection_reports: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      property_contacts: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
    };
  };
}
