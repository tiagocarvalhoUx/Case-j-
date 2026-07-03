"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
      <h1 className="text-2xl font-semibold text-navy-900">Bem-vindos de volta</h1>
      <p className="mt-2 text-sm text-ink-500">
        Entre para continuar planejando seu casamento.
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
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">
              Senha
            </Label>
            <Link
              href="/recuperar-senha"
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              Esqueci a senha
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 size={18} className="animate-spin" />}
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Ainda não tem conta?{" "}
        <Link href="/criar" className="font-semibold text-primary-600 hover:underline">
          Criar meu site grátis
        </Link>
      </p>
    </div>
  );
}
