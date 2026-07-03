"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { startGiftCheckout, type CheckoutState } from "./actions";
import { LuxeInput, LuxeLabel, LuxeTextarea, LuxeButton } from "@/components/luxe/ui";

function PayButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={15} strokeWidth={1.5} />}
      Ir para o pagamento
    </LuxeButton>
  );
}

export function CheckoutForm({
  giftId,
  defaultAmount,
  isQuota,
}: {
  giftId: string;
  defaultAmount: number;
  isQuota: boolean;
}) {
  const [state, formAction] = useActionState<CheckoutState, FormData>(
    startGiftCheckout,
    {}
  );

  // Sucesso: redireciona para a página de pagamento do Asaas.
  useEffect(() => {
    if (state.url) window.location.href = state.url;
  }, [state.url]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="gift_id" value={giftId} />

      {state.error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div>
        <LuxeLabel htmlFor="amount">Valor do presente (R$)</LuxeLabel>
        <LuxeInput
          id="amount"
          name="amount"
          inputMode="decimal"
          defaultValue={defaultAmount.toFixed(2)}
          readOnly={!isQuota}
          required
        />
        {isQuota && (
          <p className="mt-1 text-[11px] text-luxe-muted/70">
            Você pode contribuir com o valor que desejar (mínimo R$ 5,00).
          </p>
        )}
      </div>

      <div>
        <LuxeLabel htmlFor="name">Seu nome</LuxeLabel>
        <LuxeInput id="name" name="name" placeholder="Nome e sobrenome" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <LuxeLabel htmlFor="cpf">CPF</LuxeLabel>
          <LuxeInput id="cpf" name="cpf" inputMode="numeric" placeholder="000.000.000-00" required />
        </div>
        <div>
          <LuxeLabel htmlFor="email">E-mail (opcional)</LuxeLabel>
          <LuxeInput id="email" name="email" type="email" placeholder="voce@email.com" />
        </div>
      </div>

      <div>
        <LuxeLabel htmlFor="message">Recado para o casal (opcional)</LuxeLabel>
        <LuxeTextarea id="message" name="message" placeholder="Uma mensagem carinhosa..." className="min-h-20" />
      </div>

      <PayButton />

      <p className="flex items-center justify-center gap-2 text-center text-[11px] text-luxe-muted/70">
        <Lock size={12} /> Pagamento processado com segurança pelo Asaas.
      </p>
    </form>
  );
}
