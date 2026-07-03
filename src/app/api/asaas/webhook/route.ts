import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PaymentStatus } from "@/lib/supabase/types";

/**
 * Webhook do Asaas. Configure no painel Asaas:
 *   URL: https://SEU-DOMINIO/api/asaas/webhook
 *   Token de autenticação: igual ao ASAAS_WEBHOOK_TOKEN
 * O Asaas envia o token no header "asaas-access-token".
 */
export async function POST(request: NextRequest) {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  if (expected) {
    const token = request.headers.get("asaas-access-token");
    if (token !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  let body: { event?: string; payment?: { id?: string; billingType?: string } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const event = body.event;
  const paymentId = body.payment?.id;
  if (!event || !paymentId) {
    return NextResponse.json({ ok: true }); // nada a fazer
  }

  // Mapeia o evento para o status da contribuição.
  let status: PaymentStatus | null = null;
  if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") status = "paid";
  else if (event === "PAYMENT_REFUNDED") status = "refunded";
  else if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_DELETED") status = "failed";

  if (!status) return NextResponse.json({ ok: true });

  const method = body.payment?.billingType?.toLowerCase() ?? null;

  try {
    const admin = createAdminClient();
    await admin
      .from("contributions")
      .update({
        status,
        payment_method: method,
        paid_at: status === "paid" ? new Date().toISOString() : null,
      })
      .eq("asaas_payment_id", paymentId);
  } catch (e) {
    console.error("Falha ao atualizar contribuição:", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
