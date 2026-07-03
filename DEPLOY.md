# Deploy na Vercel

Guia para publicar o Case-já em produção.

## 1. Pré-requisitos

- Repositório no GitHub (este projeto)
- Projeto Supabase criado com a migration aplicada
  (`supabase/migrations/0001_init_schema.sql`)
- Conta na Vercel

## 2. Importar na Vercel

1. Acesse https://vercel.com/new e importe o repositório do GitHub.
2. A Vercel detecta **Next.js** automaticamente (não precisa mudar build/output).

## 3. Variáveis de ambiente (obrigatório)

Em **Project → Settings → Environment Variables**, adicione (ambientes
Production + Preview):

| Nome | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://SEU-PROJETO.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave **publishable/anon** |
| `SUPABASE_SERVICE_ROLE_KEY` | service role (secret) — webhook confirma pagamentos |
| `NEXT_PUBLIC_SITE_URL` | a URL de produção (ex.: `https://case-ja.vercel.app`) |
| `ASAAS_API_KEY` | chave da API do Asaas |
| `ASAAS_ENV` | `sandbox` (testes) ou `production` |
| `ASAAS_WEBHOOK_TOKEN` | um token que você define (usado no webhook) |

Depois clique em **Deploy**.

## 3.1 Configurar o webhook do Asaas (confirmação de pagamento)

No painel **Asaas → Integrações → Webhooks**, crie um webhook:
- **URL**: `https://SEU-DOMINIO/api/asaas/webhook`
- **Token de autenticação**: o mesmo valor de `ASAAS_WEBHOOK_TOKEN`
- Eventos: pagamentos (PAYMENT_CONFIRMED / PAYMENT_RECEIVED, etc.)

Sem o webhook + `SUPABASE_SERVICE_ROLE_KEY`, a cobrança é criada mas a
contribuição não é marcada como **paga** automaticamente.

## 4. Configurar Auth no Supabase (essencial p/ confirmação de e-mail)

Sem isso, os links de confirmação/redirect apontam para `localhost`.

Em **Supabase → Authentication → URL Configuration**:

- **Site URL**: `https://SEU-DOMINIO` (a URL de produção da Vercel)
- **Redirect URLs**: adicione
  - `https://SEU-DOMINIO/**`
  - `http://localhost:3000/**` (para continuar testando em dev)

## 5. Pós-deploy

- Teste o fluxo: `/criar` → confirmar e-mail → `/onboarding` → `/painel`.
- Ao apontar um **domínio próprio** na Vercel, atualize `NEXT_PUBLIC_SITE_URL`
  e a **Site URL** do Supabase para o novo domínio.

## Observações

- Segredos: **nunca** exponha a `service_role` / secret key no front. Ela só
  será usada no backend (ex.: webhook do Asaas) via variável **não** `NEXT_PUBLIC_`.
- Assets de referência (`src/background/`, `src/fonts/`) são ignorados no git; as
  imagens usadas ficam em `public/background/` e as fontes vêm do Google (next/font).
