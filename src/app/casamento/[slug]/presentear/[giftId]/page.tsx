import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gift } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Presentear" };

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string; giftId: string }>;
}) {
  const { slug, giftId } = await params;
  const supabase = await createClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, couple_names, slug, published")
    .eq("slug", slug)
    .maybeSingle();
  if (!wedding) notFound();

  const { data: gift } = await supabase
    .from("gifts")
    .select("*")
    .eq("id", giftId)
    .eq("wedding_id", wedding.id)
    .eq("active", true)
    .maybeSingle();
  if (!gift) notFound();

  return (
    <div className="min-h-screen bg-luxe-black text-luxe-cream">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link
          href={`/casamento/${slug}#presentes`}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:text-luxe-gold"
        >
          <ArrowLeft size={14} strokeWidth={1.5} /> Voltar à lista
        </Link>

        {/* Resumo do presente */}
        <div className="mt-6 flex items-center gap-4 rounded-[18px] border border-luxe-gold/15 bg-luxe-card/70 p-5">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-luxe-gold/25 text-luxe-gold">
            <Gift size={22} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="font-serif-luxe text-lg text-luxe-cream">{gift.title}</p>
            <p className="text-sm text-luxe-gold">
              {BRL.format(Number(gift.price))}
              {gift.type === "quota" && (
                <span className="text-luxe-muted"> / cota</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-serif-luxe text-xs uppercase tracking-[0.4em] text-luxe-gold">
            Presentear
          </p>
          <h1 className="mt-3 font-serif-luxe text-3xl font-light text-luxe-cream">
            {wedding.couple_names}
          </h1>
          <p className="mt-2 text-sm text-luxe-muted">
            Preencha seus dados e finalize o pagamento com segurança (Pix, boleto
            ou cartão).
          </p>
        </div>

        <div className="mt-8">
          <CheckoutForm
            giftId={gift.id}
            defaultAmount={Number(gift.price)}
            isQuota={gift.type === "quota"}
          />
        </div>
      </div>
    </div>
  );
}
