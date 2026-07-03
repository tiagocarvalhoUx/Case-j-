import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { SiteEditor } from "./site-editor";

export const metadata: Metadata = {
  title: "Editor do site",
};

export default async function SitePage() {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

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
          Site do casamento
        </h1>
        <p className="mt-1 text-luxe-muted">
          Personalize as informações e a aparência do site que seus convidados
          vão ver.
        </p>
      </div>

      <SiteEditor wedding={wedding} />
    </Container>
  );
}
