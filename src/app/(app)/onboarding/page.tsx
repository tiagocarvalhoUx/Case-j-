import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Criar meu casamento",
};

export default async function OnboardingPage() {
  // Se já existe casamento, vai direto ao painel.
  const existing = await getUserWedding();
  if (existing) redirect("/painel");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const defaultCouple =
    (user?.user_metadata?.couple_names as string | undefined) || "";

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <Badge variant="gold" className="mx-auto w-fit">
            <Heart size={14} fill="currentColor" /> Vamos começar
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold text-navy-900">
            Conte-nos sobre o casamento
          </h1>
          <p className="mt-2 text-ink-500">
            Com essas informações já criamos a base do site de vocês.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-ink-200/70 bg-white p-6 shadow-sm sm:p-8">
          <OnboardingForm defaultCouple={defaultCouple} />
        </div>
      </div>
    </Container>
  );
}
