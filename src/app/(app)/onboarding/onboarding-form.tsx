"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { createWedding, type OnboardingState } from "./actions";
import { LuxeButton, LuxeInput, LuxeLabel } from "@/components/luxe/ui";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 size={18} className="animate-spin" />}
      Criar meu casamento <ArrowRight size={16} strokeWidth={1.5} />
    </LuxeButton>
  );
}

export function OnboardingForm({ defaultCouple }: { defaultCouple: string }) {
  const [state, formAction] = useActionState<OnboardingState, FormData>(
    createWedding,
    {}
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </div>
      )}

      <div>
        <LuxeLabel htmlFor="couple">Nomes do casal</LuxeLabel>
        <LuxeInput
          id="couple"
          name="couple"
          defaultValue={defaultCouple}
          placeholder="Marina & Rafael"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <LuxeLabel htmlFor="date">Data do casamento</LuxeLabel>
          <LuxeInput id="date" name="date" type="date" className="[color-scheme:dark]" />
        </div>
        <div>
          <LuxeLabel htmlFor="city">Cidade</LuxeLabel>
          <LuxeInput id="city" name="city" placeholder="São Paulo, SP" />
        </div>
      </div>

      <p className="text-[11px] text-luxe-muted/70">
        Não se preocupe: você pode alterar tudo isso depois no editor do site.
      </p>

      <SubmitButton />
    </form>
  );
}
