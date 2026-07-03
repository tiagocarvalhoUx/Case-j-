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
    <Container className="py-10">
      <Link
        href="/painel"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900"
      >
        <ArrowLeft size={15} /> Voltar ao painel
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-semibold text-navy-900">Site do casamento</h1>
        <p className="mt-1 text-ink-500">
          Personalize as informações e a aparência do site que seus convidados
          vão ver.
        </p>
      </div>

      <SiteEditor wedding={wedding} />
    </Container>
  );
}
