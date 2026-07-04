"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Check, ExternalLink, Eye } from "lucide-react";
import {
  updateWeddingSite,
  togglePublish,
  type SiteState,
} from "./actions";
import type { Wedding } from "@/lib/supabase/types";
import { themeList } from "@/lib/themes";
import {
  LuxeCard,
  LuxeButton,
  LuxeInput,
  LuxeTextarea,
  LuxeLabel,
} from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" size="lg" disabled={pending}>
      {pending && <Loader2 size={18} className="animate-spin" />}
      Salvar alterações
    </LuxeButton>
  );
}

function PublishButton({ published }: { published: boolean }) {
  const { pending } = useFormStatus();
  return (
    <LuxeButton
      type="submit"
      variant={published ? "outline" : "gold"}
      className="w-full"
      disabled={pending}
    >
      {pending && <Loader2 size={18} className="animate-spin" />}
      {published ? "Despublicar" : "Publicar site"}
    </LuxeButton>
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
      {/* Formulário */}
      <form action={formAction} className="lg:col-span-2">
        <LuxeCard className="space-y-5">
          {state.success && (
            <div className="rounded-xl border border-luxe-gold/25 bg-luxe-gold/10 px-4 py-3 text-sm text-luxe-gold">
              <Check size={15} className="mr-1 inline" /> Alterações salvas!
            </div>
          )}
          {state.error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {state.error}
            </div>
          )}

          <div>
            <LuxeLabel htmlFor="couple">Nomes do casal</LuxeLabel>
            <LuxeInput id="couple" name="couple" defaultValue={wedding.couple_names} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <LuxeLabel htmlFor="date">Data</LuxeLabel>
              <LuxeInput id="date" name="date" type="date" defaultValue={wedding.wedding_date ?? ""} className="[color-scheme:dark]" />
            </div>
            <div>
              <LuxeLabel htmlFor="city">Cidade</LuxeLabel>
              <LuxeInput id="city" name="city" defaultValue={wedding.city ?? ""} placeholder="São Paulo, SP" />
            </div>
          </div>

          <div>
            <LuxeLabel htmlFor="venue">Local da cerimônia</LuxeLabel>
            <LuxeInput id="venue" name="venue" defaultValue={wedding.venue ?? ""} placeholder="Espaço Villa Bisutti" />
          </div>

          <div>
            <LuxeLabel htmlFor="welcome">Mensagem de boas-vindas</LuxeLabel>
            <LuxeTextarea
              id="welcome"
              name="welcome"
              defaultValue={wedding.welcome_message ?? ""}
              placeholder="Contem a história de vocês e convidem seus convidados para celebrar..."
            />
          </div>

          <div>
            <LuxeLabel htmlFor="cover">Foto de capa (URL)</LuxeLabel>
            <LuxeInput id="cover" name="cover" type="url" defaultValue={wedding.cover_image_url ?? ""} placeholder="https://..." />
            <p className="mt-1 text-[11px] text-luxe-muted/70">
              Em breve: upload direto. Por enquanto, cole a URL de uma foto.
            </p>
          </div>

          <div>
            <LuxeLabel>Tema visual</LuxeLabel>
            <input type="hidden" name="theme" value={theme} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {themeList.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  className={cn(
                    "rounded-xl border p-2 text-left transition-colors",
                    theme === t.key
                      ? "border-luxe-gold"
                      : "border-white/10 hover:border-white/25"
                  )}
                >
                  <span className={cn("block h-12 w-full rounded-lg", t.swatch)} />
                  <span className="mt-2 block text-[11px] uppercase tracking-[0.15em] text-luxe-cream/80">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <SaveButton />
        </LuxeCard>
      </form>

      {/* Publicação */}
      <div className="space-y-4">
        <LuxeCard>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-2 w-2 rounded-full",
                wedding.published ? "bg-luxe-gold" : "bg-luxe-muted/50"
              )}
            />
            <p className="font-serif-luxe text-lg text-luxe-cream">
              {wedding.published ? "Site publicado" : "Rascunho"}
            </p>
          </div>
          <p className="mt-2 text-sm text-luxe-muted">
            {wedding.published
              ? "Seu site está no ar e visível para os convidados."
              : "Publique para compartilhar o link com seus convidados."}
          </p>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-3 text-sm">
            <p className="text-[11px] uppercase tracking-[0.15em] text-luxe-muted/70">Endereço do site</p>
            <p className="mt-0.5 break-all text-luxe-cream/90">case-ja.com.br/{wedding.slug}</p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <form action={togglePublish}>
              <PublishButton published={wedding.published} />
            </form>
            {wedding.published && (
              <Link
                href={publicUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 py-2 text-[11px] uppercase tracking-[0.2em] text-luxe-gold hover:text-luxe-gold-soft"
              >
                <ExternalLink size={14} strokeWidth={1.5} /> Ver site publicado
              </Link>
            )}
          </div>
        </LuxeCard>

        <LuxeCard>
          <div className="flex items-center gap-2 text-luxe-gold">
            <Eye size={16} strokeWidth={1.5} />
            <p className="text-[11px] uppercase tracking-[0.2em]">Pré-visualização</p>
          </div>
          <p className="mt-2 text-sm text-luxe-muted">
            Abra{" "}
            <Link href={publicUrl} target="_blank" className="text-luxe-gold hover:text-luxe-gold-soft">
              o site do casamento
            </Link>{" "}
            em uma nova aba para ver como ficou (mesmo antes de publicar, você
            consegue pré-visualizar).
          </p>
        </LuxeCard>
      </div>
    </div>
  );
}
