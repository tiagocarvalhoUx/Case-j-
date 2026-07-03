"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { themes, type ThemeKey } from "@/lib/themes";

export type SiteState = { success?: boolean; error?: string };

/** Salva os campos do site do casamento. */
export async function updateWeddingSite(
  _prev: SiteState,
  formData: FormData
): Promise<SiteState> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const coupleNames = String(formData.get("couple") || "").trim();
  if (coupleNames.length < 2) {
    return { error: "Informe os nomes do casal." };
  }

  const themeInput = String(formData.get("theme") || "classic");
  const theme: ThemeKey = themeInput in themes ? (themeInput as ThemeKey) : "classic";

  const supabase = await createClient();
  const { error } = await supabase
    .from("weddings")
    .update({
      couple_names: coupleNames,
      wedding_date: String(formData.get("date") || "") || null,
      city: String(formData.get("city") || "").trim() || null,
      venue: String(formData.get("venue") || "").trim() || null,
      welcome_message: String(formData.get("welcome") || "").trim() || null,
      cover_image_url: String(formData.get("cover") || "").trim() || null,
      theme,
    })
    .eq("id", wedding.id);

  if (error) {
    return { error: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath("/site");
  revalidatePath("/painel");
  revalidatePath(`/casamento/${wedding.slug}`);
  return { success: true };
}

/** Publica ou despublica o site (alterna o estado atual). */
export async function togglePublish(): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();
  await supabase
    .from("weddings")
    .update({ published: !wedding.published })
    .eq("id", wedding.id);

  revalidatePath("/site");
  revalidatePath("/painel");
  revalidatePath(`/casamento/${wedding.slug}`);
}
