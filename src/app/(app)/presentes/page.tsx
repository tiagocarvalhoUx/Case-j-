import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { GiftsManager } from "./gifts-manager";
import type { Gift as GiftRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Lista de presentes",
};

export default async function PresentesPage() {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();
  const { data } = await supabase
    .from("gifts")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("created_at", { ascending: false });
  const gifts = (data ?? []) as GiftRow[];

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
          Lista de presentes
        </h1>
        <p className="mt-1 text-luxe-muted">
          Crie presentes em dinheiro e cotas de lua de mel. Eles aparecem no site
          do casamento assim que você publica.
        </p>
      </div>

      <GiftsManager gifts={gifts} />
    </Container>
  );
}
