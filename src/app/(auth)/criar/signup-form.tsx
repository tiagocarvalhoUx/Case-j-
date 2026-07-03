"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  LuxeButton,
  LuxeInput,
  LuxeLabel,
  LuxeTitle,
} from "@/components/luxe/ui";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const coupleNames = String(form.get("couple") || "");
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { couple_names: coupleNames },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/confirm`
            : undefined,
      },
    });

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Este e-mail já possui uma conta. Tente entrar."
          : error.message
      );
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/painel");
      router.refresh();
      return;
    }

    setConfirmSent(true);
    setLoading(false);
  }

  if (confirmSent) {
    return (
      <div className="text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-luxe-gold/30 text-luxe-gold">
          <MailCheck size={24} strokeWidth={1.5} />
        </span>
        <LuxeTitle className="mt-5 text-2xl">Confirme seu e-mail</LuxeTitle>
        <p className="mt-2 text-sm text-luxe-muted">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar sua conta e começar a planejar.
        </p>
        <Link
          href="/entrar"
          className="mt-6 inline-block text-sm text-luxe-gold hover:text-luxe-gold-soft"
        >
          Voltar para entrar
        </Link>
      </div>
    );
  }

  return (
    <div>
      <LuxeTitle className="text-3xl">Crie seu site de casamento</LuxeTitle>
      <p className="mt-2 text-sm text-luxe-muted">
        É grátis para começar. Leva menos de um minuto.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <div>
          <LuxeLabel htmlFor="couple">Nomes do casal</LuxeLabel>
          <LuxeInput
            id="couple"
            name="couple"
            placeholder="Marina & Rafael"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <LuxeLabel htmlFor="email">E-mail</LuxeLabel>
          <LuxeInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voces@email.com"
            required
          />
        </div>

        <div>
          <LuxeLabel htmlFor="password">Senha</LuxeLabel>
          <LuxeInput
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            required
          />
        </div>

        <LuxeButton type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 size={18} className="animate-spin" />}
          Criar minha conta
        </LuxeButton>

        <p className="text-center text-[11px] text-luxe-muted/70">
          Ao criar a conta, você concorda com os Termos de Uso e a Política de
          Privacidade (LGPD).
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-luxe-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-luxe-gold hover:text-luxe-gold-soft">
          Entrar
        </Link>
      </p>
    </div>
  );
}
