"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { createWedding, type OnboardingState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 size={18} className="animate-spin" />}
      Criar meu casamento <ArrowRight size={18} />
    </Button>
  );
}

export function OnboardingForm({ defaultCouple }: { defaultCouple: string }) {
  const [state, formAction] = useActionState<OnboardingState, FormData>(
    createWedding,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-600"
        >
          {state.error}
        </div>
      )}

      <div>
        <Label htmlFor="couple">Nomes do casal</Label>
        <Input
          id="couple"
          name="couple"
          defaultValue={defaultCouple}
          placeholder="Marina & Rafael"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Data do casamento</Label>
          <Input id="date" name="date" type="date" />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" placeholder="São Paulo, SP" />
        </div>
      </div>

      <p className="text-xs text-ink-400">
        Não se preocupe: você pode alterar tudo isso depois no editor do site.
      </p>

      <SubmitButton />
    </form>
  );
}
