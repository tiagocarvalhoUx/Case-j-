"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import type { VendorStatus } from "@/lib/supabase/types";

export type VendorState = { success?: boolean; error?: string };

const VALID_STATUS: VendorStatus[] = ["researching", "quoted", "hired", "paid"];

/** Adiciona um fornecedor. */
export async function addVendor(
  _prev: VendorState,
  formData: FormData
): Promise<VendorState> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const name = String(formData.get("name") || "").trim();
  if (name.length < 2) return { error: "Informe o nome do fornecedor." };

  const priceRaw = String(formData.get("price") || "").replace(",", ".");
  const price = priceRaw ? Number(priceRaw) : null;
  if (price !== null && (!Number.isFinite(price) || price < 0))
    return { error: "Valor inválido." };

  const supabase = await createClient();
  const { error } = await supabase.from("vendors").insert({
    wedding_id: wedding.id,
    name,
    category: String(formData.get("category") || "").trim() || null,
    contact_name: String(formData.get("contact_name") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    instagram: String(formData.get("instagram") || "").trim() || null,
    price,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) return { error: "Não foi possível adicionar o fornecedor." };
  revalidatePath("/fornecedores");
  revalidatePath("/painel");
  return { success: true };
}

/** Avança/define o status do fornecedor no pipeline. */
export async function setVendorStatus(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as VendorStatus;
  if (!VALID_STATUS.includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("vendors")
    .update({ status })
    .eq("id", id)
    .eq("wedding_id", wedding.id);

  revalidatePath("/fornecedores");
  revalidatePath("/painel");
}

/** Exclui um fornecedor. */
export async function deleteVendor(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  await supabase.from("vendors").delete().eq("id", id).eq("wedding_id", wedding.id);

  revalidatePath("/fornecedores");
  revalidatePath("/painel");
}
