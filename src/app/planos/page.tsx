import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { getUserWedding } from "@/lib/weddings";
import {
  getEffectivePlan,
  isTrialActive,
  trialDaysLeft,
  type PlanKey,
} from "@/lib/plans";
import { Container } from "@/components/ui/container";
import { LuxePage, LuxeBadge, LuxeEyebrow } from "@/components/luxe/ui";
import { PlansGrid } from "@/components/luxe/plans-grid";

export const metadata: Metadata = {
  title: "Planos e preços",
  description:
    "Escolha o plano do seu casamento no Case-já: comece grátis com 7 dias de Premium e pague só quando quiser mais recursos e uma taxa de presente menor.",
};

/* eslint-disable @next/next/no-img-element */

export default async function PlanosPage() {
  const wedding = await getUserWedding();
  const loggedIn = !!wedding;
  const effective: PlanKey | null = wedding ? getEffectivePlan(wedding) : null;
  const trialing = wedding ? isTrialActive(wedding) : false;
  const daysLeft = wedding ? trialDaysLeft(wedding) : 0;

  return (
    <LuxePage>
      {/* Topo simples */}
      <header className="border-b border-luxe-gold/12">
        <Container className="flex h-16 items-center justify-between">
          <Link href={loggedIn ? "/painel" : "/"} aria-label="Case-já">
            <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-16" />
          </Link>
          <Link
            href={loggedIn ? "/painel" : "/entrar"}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:text-luxe-gold"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            {loggedIn ? "Voltar ao painel" : "Entrar"}
          </Link>
        </Container>
      </header>

      <Container className="py-14">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-4 text-center">
          <LuxeEyebrow>Planos & preços</LuxeEyebrow>
          <h1 className="max-w-2xl font-serif-luxe text-4xl font-light leading-tight text-luxe-cream sm:text-5xl">
            Comece grátis. Pague só quando o seu casamento pedir mais.
          </h1>
          <p className="max-w-xl text-luxe-muted">
            Todo casal começa com{" "}
            <strong className="text-luxe-cream">7 dias de Premium liberado</strong>.
            Sem cartão, sem compromisso — e a maior parte da nossa receita vem de
            uma pequena taxa sobre os presentes, não da mensalidade.
          </p>

          {trialing && (
            <LuxeBadge variant="gold" className="mt-1">
              <Sparkles size={12} strokeWidth={2} />
              Você está no teste grátis · faltam {daysLeft}{" "}
              {daysLeft === 1 ? "dia" : "dias"}
            </LuxeBadge>
          )}
        </div>

        {/* Cards */}
        <div className="mt-12">
          <PlansGrid effective={effective} loggedIn={loggedIn} />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-luxe-muted/70">
          Os planos pagos valem pelo período contratado (da assinatura até o seu
          casamento). A taxa de presente é descontada automaticamente de cada
          presente recebido — quanto melhor o plano, menor a taxa. Você pode
          repassar essa taxa ao convidado ou assumi-la, como preferir.
        </p>
      </Container>
    </LuxePage>
  );
}
