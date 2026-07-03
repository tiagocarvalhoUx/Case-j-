"use server";

import { createClient } from "@/lib/supabase/server";
import { createCustomer, createPayment } from "@/lib/asaas";

export type CheckoutState = { url?: string; error?: string };

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export async function startGiftCheckout(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const giftId = String(formData.get("gift_id") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const cpf = onlyDigits(String(formData.get("cpf") || ""));
  const message = String(formData.get("message") || "").trim();
  const amount = Number(String(formData.get("amount") || "").replace(",", "."));

  if (name.length < 2) return { error: "Informe seu nome." };
  if (cpf.length !== 11) return { error: "Informe um CPF válido (11 dígitos)." };
  if (!Number.isFinite(amount) || amount < 5)
    return { error: "Valor mínimo de R$ 5,00." };

  const supabase = await createClient();

  // Carrega o presente (RLS: só ativo de casamento publicado é visível ao anon).
  const { data: gift } = await supabase
    .from("gifts")
    .select("id, title, wedding_id, active")
    .eq("id", giftId)
    .maybeSingle();
  if (!gift || !gift.active) return { error: "Presente indisponível." };

  const { data: wedding } = await supabase
    .from("weddings")
    .select("couple_names, published")
    .eq("id", gift.wedding_id)
    .maybeSingle();
  if (!wedding || !wedding.published)
    return { error: "Este casamento não está disponível." };

  try {
    // 1) Cliente + cobrança no Asaas (página de pagamento hospedada).
    const customer = await createCustomer({ name, email: email || undefined, cpfCnpj: cpf });
    const payment = await createPayment({
      customer: customer.id,
      value: Math.round(amount * 100) / 100,
      description: `Presente "${gift.title}" — ${wedding.couple_names}`,
      externalReference: gift.id,
    });

    // 2) Registra a contribuição pendente (RLS permite INSERT público).
    await supabase.from("contributions").insert({
      wedding_id: gift.wedding_id,
      gift_id: gift.id,
      guest_name: name,
      guest_email: email || null,
      message: message || null,
      amount: payment.value,
      status: "pending",
      asaas_payment_id: payment.id,
    });

    return { url: payment.invoiceUrl };
  } catch (e) {
    return {
      error:
        e instanceof Error ? e.message : "Não foi possível iniciar o pagamento.",
    };
  }
}
