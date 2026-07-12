/**
 * Planos do Case-já (assinatura por período) + regras de teste grátis.
 *
 * Modelo de receita híbrido:
 *  - Freemium para atrair o casal;
 *  - Planos pagos por período (da contratação até o casamento);
 *  - Taxa sobre a lista de presentes que DIMINUI conforme o plano
 *    (o plano "se paga" com uma taxa menor).
 *
 * O plano efetivo do casal é calculado em runtime a partir de:
 *  - wedding.plan            (free | essential | premium)
 *  - wedding.plan_expires_at (validade do plano pago)
 *  - wedding.trial_ends_at   (teste grátis de 7 dias = Premium liberado)
 */

import type { ThemeKey } from "@/lib/themes";

export type PlanKey = "free" | "essential" | "premium";

/** Duração do teste grátis (Premium liberado) para novos casais. */
export const TRIAL_DAYS = 7;

export interface PlanLimits {
  /** Máximo de convidados (null = ilimitado). */
  guests: number | null;
  /** Máximo de fotos na galeria (null = ilimitado). */
  photos: number | null;
  /** Temas liberados ("all" = todos). */
  themes: ThemeKey[] | "all";
  /** Domínio próprio (ex.: seunome.com.br). */
  customDomain: boolean;
  /** Remove a marca "feito com Case-já" do rodapé do site. */
  removeBranding: boolean;
}

export interface Plan {
  key: PlanKey;
  name: string;
  tagline: string;
  /** Preço em reais (0 = grátis). Cobrança única pelo período. */
  price: number;
  priceLabel: string;
  periodNote: string;
  /** Taxa aplicada a cada presente recebido (fração: 0.0399 = 3,99%). */
  giftFeeRate: number;
  giftFeeLabel: string;
  limits: PlanLimits;
  /** Destaques mostrados na página de planos. */
  perks: string[];
  highlight?: boolean;
}

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key: "free",
    name: "Grátis",
    tagline: "Para começar a montar seu casamento",
    price: 0,
    priceLabel: "Grátis",
    periodNote: "para sempre",
    giftFeeRate: 0.0499,
    giftFeeLabel: "4,99%",
    limits: {
      guests: 50,
      photos: 5,
      themes: ["clean"],
      customDomain: false,
      removeBranding: false,
    },
    perks: [
      "Site do casamento (case-ja.com.br/seu-nome)",
      "Lista de presentes em dinheiro",
      "Até 50 convidados com confirmação (RSVP)",
      "Galeria com até 5 fotos",
      "1 tema visual (Clean)",
    ],
  },
  essential: {
    key: "essential",
    name: "Essencial",
    tagline: "Tudo que a maioria dos casais precisa",
    price: 149,
    priceLabel: "R$ 149",
    periodNote: "por 12 meses",
    giftFeeRate: 0.0399,
    giftFeeLabel: "3,99%",
    limits: {
      guests: null,
      photos: 30,
      themes: "all",
      customDomain: false,
      removeBranding: false,
    },
    perks: [
      "Tudo do plano Grátis, e mais:",
      "Convidados ilimitados + confirmação (RSVP)",
      "Galeria com até 30 fotos",
      "Todos os 5 temas visuais",
      "Cronograma inteligente + Fornecedores",
      "Cotas de lua de mel",
      "Taxa de presente menor (3,99%)",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  premium: {
    key: "premium",
    name: "Premium",
    tagline: "A experiência completa, sem limites",
    price: 299,
    priceLabel: "R$ 299",
    periodNote: "por 12 meses",
    giftFeeRate: 0.0299,
    giftFeeLabel: "2,99%",
    limits: {
      guests: null,
      photos: null,
      themes: "all",
      // Domínio próprio ainda não implementado — ver roadmap (nível A: subdomínio).
      customDomain: false,
      removeBranding: true,
    },
    perks: [
      "Tudo do plano Essencial, e mais:",
      "Galeria de fotos ilimitada",
      "Site 100% de vocês (marca “Case-já” removida)",
      "A menor taxa de presente (2,99%)",
      "Suporte por WhatsApp dedicado",
    ],
  },
};

export const PLAN_LIST: Plan[] = [PLANS.free, PLANS.essential, PLANS.premium];

/** Ordem de "potência" dos planos, para comparar/gate. */
const RANK: Record<PlanKey, number> = { free: 0, essential: 1, premium: 2 };

/** Campos do casamento necessários para calcular o plano efetivo. */
export interface PlanContext {
  plan: PlanKey;
  trial_ends_at: string | null;
  plan_expires_at: string | null;
}

/** O teste grátis ainda está valendo? */
export function isTrialActive(w: PlanContext): boolean {
  if (!w.trial_ends_at) return false;
  return Date.parse(w.trial_ends_at) > Date.now();
}

/** Quantos dias faltam para o fim do teste grátis (0 se já acabou). */
export function trialDaysLeft(w: PlanContext): number {
  if (!w.trial_ends_at) return 0;
  const ms = Date.parse(w.trial_ends_at) - Date.now();
  return ms > 0 ? Math.ceil(ms / 86_400_000) : 0;
}

/** O plano pago ainda está dentro da validade? */
function isPaidPlanValid(w: PlanContext): boolean {
  if (w.plan === "free") return false;
  if (!w.plan_expires_at) return true; // sem expiração definida
  return Date.parse(w.plan_expires_at) > Date.now();
}

/**
 * Plano em vigor agora:
 *  1. plano pago válido → o próprio plano;
 *  2. senão, teste grátis ativo → Premium;
 *  3. senão → Grátis.
 */
export function getEffectivePlan(w: PlanContext): PlanKey {
  if (isPaidPlanValid(w)) return w.plan;
  if (isTrialActive(w)) return "premium";
  return "free";
}

/** Plano efetivo já resolvido para o objeto Plan completo. */
export function getPlan(w: PlanContext): Plan {
  return PLANS[getEffectivePlan(w)];
}

/** Taxa de presente (fração) do plano em vigor. */
export function getGiftFeeRate(w: PlanContext): number {
  return getPlan(w).giftFeeRate;
}

// ---- Gates de limite ----------------------------------------

export function guestLimit(w: PlanContext): number | null {
  return getPlan(w).limits.guests;
}

export function photoLimit(w: PlanContext): number | null {
  return getPlan(w).limits.photos;
}

export function isThemeAllowed(w: PlanContext, theme: ThemeKey): boolean {
  const allowed = getPlan(w).limits.themes;
  return allowed === "all" || allowed.includes(theme);
}

/** true se `plan` é igual ou superior a `min`. */
export function planAtLeast(plan: PlanKey, min: PlanKey): boolean {
  return RANK[plan] >= RANK[min];
}
