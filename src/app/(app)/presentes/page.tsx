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
    <Container className="py-10">
      <Link
        href="/painel"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900"
      >
        <ArrowLeft size={15} /> Voltar ao painel
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-semibold text-navy-900">Lista de presentes</h1>
        <p className="mt-1 text-ink-500">
          Crie presentes em dinheiro e cotas de lua de mel. Eles aparecem no site
          do casamento assim que você publica.
        </p>
      </div>

      <GiftsManager gifts={gifts} />
    </Container>
  );
}
