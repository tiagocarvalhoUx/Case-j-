import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { GuestsManager } from "./guests-manager";
import type { Guest } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Convidados & Confirmações",
};

export default async function ConvidadosPage() {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("created_at", { ascending: false });
  const guests = (data ?? []) as Guest[];

  return (
    <Container className="py-12">
      <Link
        href="/painel"
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:text-luxe-gold"
      >
        <ArrowLeft size={14} strokeWidth={1.5} /> Voltar ao painel
      </Link>

      <div className="mt-5 mb-9">
        <h1 className="font-serif-luxe text-4xl font-light text-luxe-cream">
          Convidados &amp; Confirmações
        </h1>
        <p className="mt-1 text-luxe-muted">
          Gerencie a lista, acompanhe confirmações e envie convites pelo
          WhatsApp com o link do site.
        </p>
      </div>

      <GuestsManager
        guests={guests}
        slug={wedding.slug}
        coupleNames={wedding.couple_names}
      />
    </Container>
  );
}
