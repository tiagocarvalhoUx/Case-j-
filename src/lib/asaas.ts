/**
 * Cliente mínimo da API do Asaas (server-only).
 * Requer as variáveis de ambiente:
 *   ASAAS_API_KEY  — chave da API (nunca expor no client)
 *   ASAAS_ENV      — "sandbox" (padrão) ou "production"
 */

const BASE =
  process.env.ASAAS_ENV === "production"
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";

function apiKey(): string {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY não configurada.");
  return key;
}

async function asaasFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data?.errors && data.errors[0]?.description) ||
      `Erro Asaas (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email?: string;
}

export interface AsaasPayment {
  id: string;
  status: string;
  value: number;
  invoiceUrl: string;
  externalReference?: string;
}

/** Cria (ou reaproveita) um cliente no Asaas. */
export function createCustomer(input: {
  name: string;
  email?: string;
  cpfCnpj: string;
  mobilePhone?: string;
}) {
  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * Cria uma cobrança. billingType "UNDEFINED" gera uma página de pagamento
 * (invoiceUrl) onde o convidado escolhe Pix, boleto ou cartão.
 */
export function createPayment(input: {
  customer: string;
  value: number;
  description: string;
  externalReference?: string;
  dueDate?: string; // YYYY-MM-DD
}) {
  const dueDate =
    input.dueDate ??
    new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
  return asaasFetch<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      billingType: "UNDEFINED",
      customer: input.customer,
      value: input.value,
      description: input.description,
      externalReference: input.externalReference,
      dueDate,
    }),
  });
}
