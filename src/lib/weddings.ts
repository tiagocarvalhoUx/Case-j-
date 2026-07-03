import { createClient } from "@/lib/supabase/server";
import type { Wedding } from "@/lib/supabase/types";

/**
 * Retorna o casamento do usuário autenticado (ou null se ainda não criou).
 * Usa o client server (respeita RLS: só enxerga o próprio).
 */
export async function getUserWedding(): Promise<Wedding | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

/** Gera um slug amigável a partir dos nomes do casal. */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // remove acentos
      .toLowerCase()
      .replace(/&/g, "-e-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-")
      .slice(0, 48) || "casamento"
  );
}
