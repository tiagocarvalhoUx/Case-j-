-- ============================================================
-- Case-já — Migration 0006: planos e teste grátis (trial)
-- Adiciona o modelo de assinatura por período ao casamento:
--   plan            free | essential | premium
--   trial_ends_at   fim do teste grátis de 7 dias (Premium liberado)
--   plan_expires_at validade do plano pago (null = sem expiração)
-- E registra a taxa de presente aplicada em cada contribuição
-- (fee_rate), pois a taxa depende do plano do casal no momento.
-- Aplicar no Supabase: SQL Editor → colar → Run.
-- ============================================================

-- Enum de planos --------------------------------------------
do $$ begin
  create type public.plan_tier as enum ('free', 'essential', 'premium');
exception when duplicate_object then null; end $$;

-- Colunas em weddings ---------------------------------------
alter table public.weddings
  add column if not exists plan            public.plan_tier not null default 'free',
  add column if not exists trial_ends_at   timestamptz default (now() + interval '7 days'),
  add column if not exists plan_expires_at timestamptz;

-- Backfill: dá um teste grátis de 7 dias a partir de agora para os
-- casamentos já existentes (para poderem experimentar o Premium).
update public.weddings
  set trial_ends_at = now() + interval '7 days'
  where trial_ends_at is null;

-- Taxa de presente aplicada, gravada no momento da contribuição --
alter table public.contributions
  add column if not exists fee_rate numeric(5,4);

-- ============================================================
-- Observação de segurança:
-- 'plan' e 'plan_expires_at' são definidos pelo backend (webhook do
-- gateway / service role) na confirmação do pagamento do plano.
-- A política RLS de weddings permite ao dono atualizar seu registro,
-- então NÃO confie no cliente para elevar o plano: a ativação de
-- plano paga deve ser feita pelo service role no fluxo de cobrança.
-- ============================================================
