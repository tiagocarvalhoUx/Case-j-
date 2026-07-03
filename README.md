# Case-já — SaaS de Casamentos

Plataforma para casais planejarem o casamento com simplicidade: **site
personalizado**, **lista de presentes convertível em dinheiro**, **cotas de lua
de mel**, **RSVP/convidados**, fornecedores e cronograma.

> _"Planeje seu casamento com simplicidade."_

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config CSS-first em `src/app/globals.css`)
- **Supabase** — Postgres, Auth e Storage
- **Asaas** — pagamentos (Pix, boleto, cartão, split) _(a integrar)_
- `lucide-react`, `class-variance-authority`, `tailwind-merge`

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # e preencha as chaves do Supabase
npm run dev                         # http://localhost:3000
```

Variáveis necessárias (ver `.env.local.example`):

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publishable/anon |
| `NEXT_PUBLIC_SITE_URL` | (opcional) URL pública em produção |

## Banco de dados

Aplique a migration `supabase/migrations/0001_init_schema.sql` no **SQL Editor**
do Supabase. Ela cria as tabelas (`weddings`, `guests`, `gifts`,
`contributions`) com **RLS** (cada casal só acessa os próprios dados; site e
presentes só ficam públicos quando publicados).

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — lint

## Deploy

Veja **[DEPLOY.md](DEPLOY.md)** para o passo a passo na Vercel.

## Rotas principais

- `/` — landing page
- `/entrar`, `/criar` — autenticação
- `/painel` — painel do casal (protegido)
- `/onboarding` — criação do casamento
- `/site` — editor do site do casamento
- `/presentes` — lista de presentes
- `/casamento/[slug]` — site público do casamento
