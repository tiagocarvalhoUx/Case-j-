import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Client Supabase com a service role key — ignora RLS.
 * Uso EXCLUSIVO no servidor (ex.: webhook do Asaas para confirmar pagamentos).
 * Requer SUPABASE_SERVICE_ROLE_KEY (nunca expor no client / sem NEXT_PUBLIC).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase admin não configurado (SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
