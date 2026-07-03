import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { LuxeCard, LuxeEyebrow, LuxeTitle } from "@/components/luxe/ui";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Criar meu casamento",
};

export default async function OnboardingPage() {
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
        <div className="flex flex-col items-center text-center">
          <LuxeEyebrow>Vamos começar</LuxeEyebrow>
          <LuxeTitle className="mt-5 text-3xl">
            Conte-nos sobre o casamento
          </LuxeTitle>
          <p className="mt-2 text-luxe-muted">
            Com essas informações já criamos a base do site de vocês.
          </p>
        </div>

        <LuxeCard className="mt-8 p-6 sm:p-8">
          <OnboardingForm defaultCouple={defaultCouple} />
        </LuxeCard>
      </div>
    </Container>
  );
}
