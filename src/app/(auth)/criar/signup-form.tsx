"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

    // Sessão já criada (confirmação de e-mail desativada) → vai ao painel.
    if (data.session) {
      router.push("/painel");
      router.refresh();
      return;
    }

    // Caso contrário, precisa confirmar o e-mail.
    setConfirmSent(true);
    setLoading(false);
  }

  if (confirmSent) {
    return (
      <div className="text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <MailCheck size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-navy-900">
          Confirme seu e-mail
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar sua conta e começar a planejar.
        </p>
        <Link href="/entrar" className="mt-6 inline-block text-sm font-semibold text-primary-600 hover:underline">
          Voltar para entrar
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-900">
        Crie seu site de casamento
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        É grátis para começar. Leva menos de um minuto.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-600"
          >
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="couple">Nomes do casal</Label>
          <Input
            id="couple"
            name="couple"
            placeholder="Marina & Rafael"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voces@email.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 size={18} className="animate-spin" />}
          Criar minha conta
        </Button>

        <p className="text-center text-xs text-ink-400">
          Ao criar a conta, você concorda com os Termos de Uso e a Política de
          Privacidade (LGPD).
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-semibold text-primary-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
