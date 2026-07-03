/**
 * Tipos do banco Case-já (espelham supabase/migrations/0001_init_schema.sql).
 * Mantidos à mão por enquanto; quando o Supabase CLI estiver conectado à conta,
 * podem ser regenerados com `supabase gen types typescript`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RsvpStatus = "pending" | "confirmed" | "declined";
export type GiftType = "fixed" | "quota";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type VendorStatus = "researching" | "quoted" | "hired" | "paid";

export interface Database {
  public: {
    Tables: {
      weddings: {
        Row: {
          id: string;
          owner_id: string;
          couple_names: string;
          slug: string;
          wedding_date: string | null;
          city: string | null;
          venue: string | null;
          welcome_message: string | null;
          cover_image_url: string | null;
          theme: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string;
          couple_names: string;
          slug: string;
          wedding_date?: string | null;
          city?: string | null;
          venue?: string | null;
          welcome_message?: string | null;
          cover_image_url?: string | null;
          theme?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["weddings"]["Insert"]>;
        Relationships: [];
      };
      guests: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          party_group: string | null;
          party_size: number;
          rsvp: RsvpStatus;
          table_number: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          party_group?: string | null;
          party_size?: number;
          rsvp?: RsvpStatus;
          table_number?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guests"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "guests_wedding_id_fkey";
            columns: ["wedding_id"];
            referencedRelation: "weddings";
            referencedColumns: ["id"];
          }
        ];
      };
      gifts: {
        Row: {
          id: string;
          wedding_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          category: string | null;
          type: GiftType;
          price: number;
          target_amount: number | null;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          category?: string | null;
          type?: GiftType;
          price?: number;
          target_amount?: number | null;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gifts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "gifts_wedding_id_fkey";
            columns: ["wedding_id"];
            referencedRelation: "weddings";
            referencedColumns: ["id"];
          }
        ];
      };
      contributions: {
        Row: {
          id: string;
          wedding_id: string;
          gift_id: string;
          guest_name: string;
          guest_email: string | null;
          message: string | null;
          amount: number;
          status: PaymentStatus;
          payment_method: string | null;
          asaas_payment_id: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          gift_id: string;
          guest_name: string;
          guest_email?: string | null;
          message?: string | null;
          amount: number;
          status?: PaymentStatus;
          payment_method?: string | null;
          asaas_payment_id?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contributions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "contributions_wedding_id_fkey";
            columns: ["wedding_id"];
            referencedRelation: "weddings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contributions_gift_id_fkey";
            columns: ["gift_id"];
            referencedRelation: "gifts";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          id: string;
          wedding_id: string;
          title: string;
          description: string | null;
          category: string | null;
          due_date: string | null;
          done: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          title: string;
          description?: string | null;
          category?: string | null;
          due_date?: string | null;
          done?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "tasks_wedding_id_fkey";
            columns: ["wedding_id"];
            referencedRelation: "weddings";
            referencedColumns: ["id"];
          }
        ];
      };
      vendors: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          category: string | null;
          contact_name: string | null;
          phone: string | null;
          email: string | null;
          instagram: string | null;
          price: number | null;
          status: VendorStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          category?: string | null;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          instagram?: string | null;
          price?: number | null;
          status?: VendorStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "vendors_wedding_id_fkey";
            columns: ["wedding_id"];
            referencedRelation: "weddings";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_wedding_owner: {
        Args: { wid: string };
        Returns: boolean;
      };
    };
    Enums: {
      rsvp_status: RsvpStatus;
      gift_type: GiftType;
      payment_status: PaymentStatus;
      vendor_status: VendorStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

/** Atalhos de conveniência. */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Wedding = Tables<"weddings">;
export type Guest = Tables<"guests">;
export type Gift = Tables<"gifts">;
export type Contribution = Tables<"contributions">;
export type Task = Tables<"tasks">;
export type Vendor = Tables<"vendors">;
