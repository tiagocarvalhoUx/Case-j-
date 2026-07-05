import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { getUserWedding } from "@/lib/weddings";
import {
  PLAN_LIST,
  getEffectivePlan,
  isTrialActive,
  trialDaysLeft,
  type PlanKey,
} from "@/lib/plans";
import { Container } from "@/components/ui/container";
import {
  LuxePage,
  LuxeCard,
  LuxeBadge,
  LuxeEyebrow,
  luxeButton,
} from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Planos e preços",
  description:
    "Escolha o plano do seu casamento no Case-já: comece grátis com 7 dias de Premium e pague só quando quiser mais recursos e uma taxa de presente menor.",
};

/* eslint-disable @next/next/no-img-element */

const WHATSAPP = "5518981142927";

function assinarLink(planName: string) {
  const msg = `Olá! Quero assinar o plano ${planName} do Case-já.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

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
            Todo casal começa com <strong className="text-luxe-cream">7 dias
            de Premium liberado</strong>. Sem cartão, sem compromisso — e a maior
            parte da nossa receita vem de uma pequena taxa sobre os presentes,
            não da mensalidade.
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
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {PLAN_LIST.map((plan) => {
            const isCurrent = effective === plan.key;
            const featured = plan.highlight;

            return (
              <LuxeCard
                key={plan.key}
                className={cn(
                  "flex flex-col",
                  featured &&
                    "border-luxe-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.12)] lg:-mt-3 lg:mb-3"
                )}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-luxe text-2xl text-luxe-cream">
                    {plan.name}
                  </h2>
                  {featured && !isCurrent && (
                    <LuxeBadge variant="gold">Mais popular</LuxeBadge>
                  )}
                  {isCurrent && <LuxeBadge variant="emerald">Plano atual</LuxeBadge>}
                </div>

                <p className="mt-1 text-sm text-luxe-muted">{plan.tagline}</p>

                <div className="mt-5 flex items-end gap-2">
                  <span className="font-serif-luxe text-4xl font-light text-luxe-gold">
                    {plan.priceLabel}
                  </span>
                  <span className="pb-1.5 text-xs text-luxe-muted">
                    {plan.periodNote}
                  </span>
                </div>

                <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <p className="text-xs text-luxe-muted">
                    Taxa por presente recebido
                  </p>
                  <p className="font-serif-luxe text-xl text-luxe-cream">
                    {plan.giftFeeLabel}
                  </p>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={16}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-luxe-gold"
                      />
                      <span className="text-luxe-cream/85">{perk}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <PlanCta
                    planKey={plan.key}
                    planName={plan.name}
                    isCurrent={isCurrent}
                    loggedIn={loggedIn}
                    featured={!!featured}
                  />
                </div>
              </LuxeCard>
            );
          })}
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

function PlanCta({
  planKey,
  planName,
  isCurrent,
  loggedIn,
  featured,
}: {
  planKey: PlanKey;
  planName: string;
  isCurrent: boolean;
  loggedIn: boolean;
  featured: boolean;
}) {
  if (isCurrent) {
    return (
      <span
        className={cn(
          luxeButton({ variant: "outline", size: "md" }),
          "w-full cursor-default opacity-60"
        )}
      >
        Plano atual
      </span>
    );
  }

  if (planKey === "free") {
    return (
      <a
        href={loggedIn ? "/painel" : "/criar"}
        className={cn(luxeButton({ variant: "ghost", size: "md" }), "w-full")}
      >
        {loggedIn ? "Continuar no painel" : "Começar grátis"}
      </a>
    );
  }

  // Planos pagos → contratação assistida por enquanto (WhatsApp).
  return (
    <a
      href={assinarLink(planName)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        luxeButton({ variant: featured ? "gold" : "outline", size: "md" }),
        "w-full"
      )}
    >
      Assinar {planName}
    </a>
  );
}
