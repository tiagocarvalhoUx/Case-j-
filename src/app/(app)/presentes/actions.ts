"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import type { GiftType } from "@/lib/supabase/types";

export type GiftState = { success?: boolean; error?: string };

function revalidateGiftViews(slug: string) {
  revalidatePath("/presentes");
  revalidatePath("/painel");
  revalidatePath(`/casamento/${slug}`);
}

/** Cria um presente (valor fixo ou cota) na lista do casal. */
export async function createGift(
  _prev: GiftState,
  formData: FormData
): Promise<GiftState> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const title = String(formData.get("title") || "").trim();
  const priceRaw = String(formData.get("price") || "").replace(",", ".");
  const price = Number(priceRaw);

  if (title.length < 2) return { error: "Informe um nome para o presente." };
  if (!Number.isFinite(price) || price <= 0)
    return { error: "Informe um valor válido." };

  const type: GiftType = formData.get("type") === "quota" ? "quota" : "fixed";

  const supabase = await createClient();
  const { error } = await supabase.from("gifts").insert({
    wedding_id: wedding.id,
    title,
    description: String(formData.get("description") || "").trim() || null,
    category: String(formData.get("category") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null,
    type,
    price,
  });

  if (error) return { error: "Não foi possível salvar o presente." };

  revalidateGiftViews(wedding.slug);
  return { success: true };
}

/** Exclui um presente. */
export async function deleteGift(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");
  const id = String(formData.get("id") || "");

  const supabase = await createClient();
  await supabase.from("gifts").delete().eq("id", id).eq("wedding_id", wedding.id);

  revalidateGiftViews(wedding.slug);
}

/** Ativa/desativa a exibição de um presente no site público. */
export async function toggleGiftActive(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");
  const id = String(formData.get("id") || "");
  const next = formData.get("active") === "true";

  const supabase = await createClient();
  await supabase
    .from("gifts")
    .update({ active: next })
    .eq("id", id)
    .eq("wedding_id", wedding.id);

  revalidateGiftViews(wedding.slug);
}
