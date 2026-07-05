"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { getPlan, guestLimit } from "@/lib/plans";
import type { RsvpStatus } from "@/lib/supabase/types";

export type GuestState = { success?: boolean; error?: string };

const VALID_RSVP: RsvpStatus[] = ["pending", "confirmed", "declined"];

/** Adiciona um convidado manualmente. */
export async function addGuest(
  _prev: GuestState,
  formData: FormData
): Promise<GuestState> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const name = String(formData.get("name") || "").trim();
  if (name.length < 2) return { error: "Informe o nome do convidado." };

  const partySize = Math.max(1, Number(formData.get("party_size") || 1));

  const supabase = await createClient();

  // Gate por plano: limite de convidados no plano Grátis.
  const limit = guestLimit(wedding);
  if (limit !== null) {
    const { count } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("wedding_id", wedding.id);
    if ((count ?? 0) >= limit) {
      return {
        error: `Seu plano ${getPlan(wedding).name} permite até ${limit} convidados. Assine um plano superior em /planos para adicionar mais.`,
      };
    }
  }

  const { error } = await supabase.from("guests").insert({
    wedding_id: wedding.id,
    name,
    phone: String(formData.get("phone") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    party_group: String(formData.get("party_group") || "").trim() || null,
    party_size: partySize,
  });

  if (error) return { error: "Não foi possível adicionar o convidado." };

  revalidatePath("/convidados");
  revalidatePath("/painel");
  return { success: true };
}

/** Altera o status de RSVP (ex.: confirmou por telefone). */
export async function setGuestRsvp(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const rsvp = String(formData.get("rsvp") || "") as RsvpStatus;
  if (!VALID_RSVP.includes(rsvp)) return;

  const supabase = await createClient();
  await supabase
    .from("guests")
    .update({ rsvp })
    .eq("id", id)
    .eq("wedding_id", wedding.id);

  revalidatePath("/convidados");
  revalidatePath("/painel");
}

/** Exclui um convidado. */
export async function deleteGuest(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  await supabase.from("guests").delete().eq("id", id).eq("wedding_id", wedding.id);

  revalidatePath("/convidados");
  revalidatePath("/painel");
}
