"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/weddings";

export type OnboardingState = { error?: string };

/**
 * Cria o registro de casamento do casal. Gera um slug único (tenta a base e,
 * em caso de colisão, acrescenta um sufixo curto).
 */
export async function createWedding(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const coupleNames = String(formData.get("couple") || "").trim();
  const weddingDate = String(formData.get("date") || "").trim();
  const city = String(formData.get("city") || "").trim();

  if (coupleNames.length < 2) {
    return { error: "Informe os nomes do casal." };
  }

  const base = slugify(coupleNames);

  // Tenta inserir; em colisão de slug (unique_violation 23505) tenta de novo.
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug =
      attempt === 0
        ? base
        : `${base}-${Math.random().toString(36).slice(2, 6)}`;

    const { error } = await supabase.from("weddings").insert({
      owner_id: user.id,
      couple_names: coupleNames,
      slug,
      wedding_date: weddingDate || null,
      city: city || null,
    });

    if (!error) {
      redirect("/painel");
    }

    // 23505 = unique_violation (slug já usado) → tenta outro slug.
    if (error.code !== "23505") {
      return { error: "Não foi possível criar seu casamento. Tente novamente." };
    }
  }

  return { error: "Não foi possível gerar um endereço único. Tente outro nome." };
}
