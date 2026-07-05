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

/** Adiciona uma foto à galeria do casal. */
export async function addPhoto(
  _prev: SiteState,
  formData: FormData
): Promise<SiteState> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const url = String(formData.get("url") || "").trim();
  if (!/^https?:\/\/.+/i.test(url)) {
    return { error: "Cole uma URL válida de imagem (https://...)." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("photos").insert({
    wedding_id: wedding.id,
    url,
    caption: String(formData.get("caption") || "").trim() || null,
  });

  if (error) return { error: "Não foi possível adicionar a foto." };

  revalidatePath("/site");
  revalidatePath(`/casamento/${wedding.slug}`);
  return { success: true };
}

/** Remove uma foto da galeria (e o arquivo do Storage, se for nosso). */
export async function deletePhoto(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const supabase = await createClient();

  const { data: photo } = await supabase
    .from("photos")
    .select("url")
    .eq("id", id)
    .eq("wedding_id", wedding.id)
    .maybeSingle();

  await supabase.from("photos").delete().eq("id", id).eq("wedding_id", wedding.id);

  // Se a foto foi enviada por upload (bucket "photos"), apaga o arquivo também.
  const marker = "/storage/v1/object/public/photos/";
  if (photo?.url.includes(marker)) {
    const path = decodeURIComponent(photo.url.split(marker)[1] ?? "");
    if (path) await supabase.storage.from("photos").remove([path]);
  }

  revalidatePath("/site");
  revalidatePath(`/casamento/${wedding.slug}`);
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
