"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  LuxeButton,
  LuxeInput,
  LuxeLabel,
  LuxeTitle,
} from "@/components/luxe/ui";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/painel";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div>
      <LuxeTitle className="text-3xl">Bem-vindos de volta</LuxeTitle>
      <p className="mt-2 text-sm text-luxe-muted">
        Entre para continuar planejando seu casamento.
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
          <div className="mb-2 flex items-center justify-between">
            <LuxeLabel htmlFor="password" className="mb-0">
              Senha
            </LuxeLabel>
            <Link
              href="/recuperar-senha"
              className="text-[11px] uppercase tracking-[0.15em] text-luxe-gold/80 hover:text-luxe-gold"
            >
              Esqueci a senha
            </Link>
          </div>
          <LuxeInput
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <LuxeButton type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 size={18} className="animate-spin" />}
          Entrar
        </LuxeButton>
      </form>

      <p className="mt-8 text-center text-sm text-luxe-muted">
        Ainda não tem conta?{" "}
        <Link href="/criar" className="text-luxe-gold hover:text-luxe-gold-soft">
          Criar meu site
        </Link>
      </p>
    </div>
  );
}
