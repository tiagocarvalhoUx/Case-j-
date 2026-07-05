import { Check } from "lucide-react";
import { PLAN_LIST, type PlanKey } from "@/lib/plans";
import { LuxeCard, LuxeBadge, luxeButton } from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

const WHATSAPP = "5518981142927";

function assinarLink(planName: string) {
  const msg = `Olá! Quero assinar o plano ${planName} do Case-já.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

/**
 * Grade de planos (apresentacional — sem chamadas de servidor).
 * Usada na landing pública e na página /planos.
 * `effective` marca o plano em vigor do casal logado (badge "Plano atual").
 */
export function PlansGrid({
  effective = null,
  loggedIn = false,
}: {
  effective?: PlanKey | null;
  loggedIn?: boolean;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
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
              <h3 className="font-serif-luxe text-2xl text-luxe-cream">
                {plan.name}
              </h3>
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
              <p className="text-xs text-luxe-muted">Taxa por presente recebido</p>
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
