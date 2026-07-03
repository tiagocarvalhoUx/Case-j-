"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Check, ExternalLink, Globe } from "lucide-react";
import {
  updateWeddingSite,
  togglePublish,
  type SiteState,
} from "./actions";
import type { Wedding } from "@/lib/supabase/types";
import { themeList } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending && <Loader2 size={18} className="animate-spin" />}
      Salvar alterações
    </Button>
  );
}

function PublishButton({ published }: { published: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={published ? "outline" : "gold"}
      disabled={pending}
    >
      {pending && <Loader2 size={18} className="animate-spin" />}
      {published ? "Despublicar" : "Publicar site"}
    </Button>
  );
}

export function SiteEditor({ wedding }: { wedding: Wedding }) {
  const [state, formAction] = useActionState<SiteState, FormData>(
    updateWeddingSite,
    {}
  );
  const [theme, setTheme] = useState(wedding.theme || "classic");

  const publicUrl = `/casamento/${wedding.slug}`;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Coluna do formulário */}
      <form action={formAction} className="lg:col-span-2">
        <Card className="space-y-5">
          {state.success && (
            <div className="rounded-xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-600">
              <Check size={15} className="mr-1 inline" /> Alterações salvas!
            </div>
          )}
          {state.error && (
            <div className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-600">
              {state.error}
            </div>
          )}

          <div>
            <Label htmlFor="couple">Nomes do casal</Label>
            <Input
              id="couple"
              name="couple"
              defaultValue={wedding.couple_names}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={wedding.wedding_date ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                defaultValue={wedding.city ?? ""}
                placeholder="São Paulo, SP"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="venue">Local da cerimônia</Label>
            <Input
              id="venue"
              name="venue"
              defaultValue={wedding.venue ?? ""}
              placeholder="Espaço Villa Bisutti"
            />
          </div>

          <div>
            <Label htmlFor="welcome">Mensagem de boas-vindas</Label>
            <Textarea
              id="welcome"
              name="welcome"
              defaultValue={wedding.welcome_message ?? ""}
              placeholder="Contem a história de vocês e convidem seus convidados para celebrar..."
            />
          </div>

          <div>
            <Label htmlFor="cover">Foto de capa (URL)</Label>
            <Input
              id="cover"
              name="cover"
              type="url"
              defaultValue={wedding.cover_image_url ?? ""}
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-ink-400">
              Em breve: upload direto. Por enquanto, cole a URL de uma foto.
            </p>
          </div>

          <div>
            <Label>Tema visual</Label>
            <input type="hidden" name="theme" value={theme} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {themeList.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  className={cn(
                    "rounded-xl border-2 p-2 text-left transition-colors",
                    theme === t.key
                      ? "border-primary-500"
                      : "border-ink-200 hover:border-ink-300"
                  )}
                >
                  <span className={cn("block h-12 w-full rounded-lg", t.swatch)} />
                  <span className="mt-2 block text-xs font-medium text-navy-900">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <SaveButton />
        </Card>
      </form>

      {/* Coluna de publicação */}
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-2.5 w-2.5 rounded-full",
                wedding.published ? "bg-success-500" : "bg-ink-300"
              )}
            />
            <p className="text-sm font-semibold text-navy-900">
              {wedding.published ? "Site publicado" : "Rascunho"}
            </p>
          </div>
          <p className="mt-2 text-sm text-ink-500">
            {wedding.published
              ? "Seu site está no ar e visível para os convidados."
              : "Publique para compartilhar o link com seus convidados."}
          </p>

          <div className="mt-4 rounded-xl bg-surface-muted p-3 text-sm">
            <p className="text-xs text-ink-400">Endereço do site</p>
            <p className="mt-0.5 break-all font-medium text-navy-900">
              case-ja.com.br/{wedding.slug}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <form action={togglePublish}>
              <div className="w-full [&>button]:w-full">
                <PublishButton published={wedding.published} />
              </div>
            </form>
            {wedding.published && (
              <Link
                href={publicUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
              >
                <ExternalLink size={15} /> Ver site publicado
              </Link>
            )}
          </div>
        </Card>

        <Card className="bg-primary-50/50">
          <div className="flex items-center gap-2 text-primary-700">
            <Globe size={18} />
            <p className="text-sm font-semibold">Pré-visualização</p>
          </div>
          <p className="mt-2 text-sm text-ink-500">
            Abra{" "}
            <Link
              href={publicUrl}
              target="_blank"
              className="font-medium text-primary-600 hover:underline"
            >
              o site do casamento
            </Link>{" "}
            em uma nova aba para ver como ficou (mesmo antes de publicar, você
            consegue pré-visualizar).
          </p>
        </Card>
      </div>
    </div>
  );
}
