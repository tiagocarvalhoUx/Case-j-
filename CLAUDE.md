# Case-já — SaaS de Casamentos

Plataforma para casais planejarem o casamento: site personalizado, lista de
presentes convertível em dinheiro, cotas de lua de mel, RSVP/convidados,
fornecedores e cronograma. Slogan: **"Planeje seu casamento com simplicidade"**.
Especificação completa em [docs/Prompt para SaaS de Casamentos.md](docs/Prompt%20para%20SaaS%20de%20Casamentos.md).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config CSS-first via `@theme` em `src/app/globals.css`; não há `tailwind.config.js`)
- **Supabase** (Postgres, Auth, Storage) — a integrar
- **Asaas** — gateway de pagamento (Pix, boleto, cartão, split) — a integrar
- `class-variance-authority` + `clsx` + `tailwind-merge` (`cn` em `src/lib/utils.ts`)
- Ícones: `lucide-react`

## Comandos

- `npm run dev` — servidor local (http://localhost:3000)
- `npm run build` — build de produção (valida TS + ESLint + tokens)
- `npm run lint`

## Design System

Tokens em [src/app/globals.css](src/app/globals.css) (bloco `@theme`):

- **Cores da marca**: `primary` (azul cobalto), `navy` (marinho), `gold` (dourado),
  `ink` (neutros slate). Ex.: `bg-primary-600`, `text-navy-900`, `text-gold-400`.
- **Tipografia**: `font-sans` = **Inter** (interface/formulários/botões);
  `font-display` = **Playfair Display** (títulos — auto em h1–h4);
  `font-script` = **Great Vibes** (logo/assinatura — usada no nome do casal do
  site público). Fontes carregadas em `layout.tsx` via next/font.
- Utilitários próprios: `text-gradient-brand`, `animate-float`, `animate-fade-up`.

Componentes-base em `src/components/ui/`: `Button` (variantes primary/secondary/
outline/ghost/gold/link via `buttonVariants`), `Card`, `Badge`, `Input`,
`Container`, `Logo`/`LogoMark`.
Componentes de página em `src/components/site/`: `Navbar`, `Footer`, `SectionHeading`.

## Marca / assets

- Logo oficial (lockup horizontal, PNG transparente): `src/logo/case-ja-2.png`,
  usado via `<Logo />`. `<Logo light />` aplica `brightness-0 invert` para
  fundos escuros.

## Convenções

- **Idioma**: pt-BR em toda a UI e conteúdo.
- **Proibições do escopo** (ver doc §6): responsividade obrigatória; conformidade
  LGPD; não expor dados financeiros sem padrões de segurança.
- Botões que são links usam `<a className={buttonVariants({...})}>` (o `Button`
  não suporta `asChild`).

## Autenticação (Supabase)

- Clients em `src/lib/supabase/` (`client.ts` browser, `server.ts` server,
  `middleware.ts` sessão + proteção de rotas). Middleware raiz em `middleware.ts`.
- Rotas: `/entrar` (login), `/criar` (cadastro), `/auth/confirm` (confirmação
  de e-mail), `/painel` (protegida). Grupos `(auth)` e `(app)`.
- Requer `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ver `.env.local.example`). Reiniciar o dev
  após criar/alterar o `.env.local`.
- **Atenção**: o MCP do Supabase neste ambiente está logado na org
  `chaveiro-concordia`, NÃO na conta do usuário (`eliteprime`). Provisionar o
  projeto do Case-já deve ser feito na conta eliteprime (manual ou reconectando
  o MCP).

## Banco de dados

- Migration em [supabase/migrations/0001_init_schema.sql](supabase/migrations/0001_init_schema.sql).
  Aplicar via **SQL Editor** do Supabase (o MCP daqui não alcança a conta eliteprime).
- Tabelas: `weddings` (1 por casal, tem `slug` p/ site público e `published`),
  `guests` (RSVP), `gifts` (`type` fixed|quota), `contributions` (pagamentos Asaas).
- **RLS**: dono tem acesso total via `is_wedding_owner()`; leitura pública só de
  `weddings.published` e `gifts.active`; `contributions` permite INSERT público
  (status `pending`) — confirmação de pagamento é feita pelo backend (service role).
- Tipos TS em [src/lib/supabase/types.ts](src/lib/supabase/types.ts) (`Database`,
  `Wedding`, `Guest`, `Gift`, `Contribution`); clients já tipados.

## Estado atual / próximos passos

Feito: fundação + design system + landing page + autenticação (Supabase real
conectado) + schema/RLS (migration escrita) + onboarding (`/onboarding`, cria
`weddings`) + painel com dados reais (`/painel` lê wedding + contagens).
Fluxo: signup → (login) → `/painel` sem wedding → `/onboarding` → `/painel`.

**Pendências para o fluxo funcionar de ponta a ponta:**
1. Aplicar `supabase/migrations/0001_init_schema.sql` no SQL Editor (tabelas ainda
   não existem — REST responde PGRST205).
2. Para testar login imediato em dev: desativar "Confirm email" em Authentication
   → Providers → Email (ou confirmar via link no e-mail).

Feito também: **hero da landing com fundo fotográfico animado** (slideshow
crossfade + Ken Burns em `src/components/site/hero-slideshow.tsx`, controlado por
JS; imagens em `public/background/`, temporização 9s/foto + fade 3s); **editor do
site** (`/site`, salva campos + publica/despublica); **página pública**
`/casamento/[slug]` (hero temático via `src/lib/themes.ts`, contagem regressiva,
lista de presentes — RLS deixa o dono pré-visualizar antes de publicar).

A seguir: RSVP público na página do casamento → CRUD da lista de presentes no
painel → checkout Asaas (Pix/boleto/cartão) → confirmação via webhook.
