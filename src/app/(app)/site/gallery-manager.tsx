"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Trash2, Images } from "lucide-react";
import { addPhoto, deletePhoto, type SiteState } from "./actions";
import type { Photo } from "@/lib/supabase/types";
import { LuxeCard, LuxeButton, LuxeInput, LuxeLabel } from "@/components/luxe/ui";

/* eslint-disable @next/next/no-img-element */

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
      Adicionar foto
    </LuxeButton>
  );
}

/**
 * Galeria do casal no editor: adiciona fotos por URL (com legenda opcional)
 * e remove. Elas aparecem na seção "Nossos momentos" do site público,
 * com lightbox/carrossel para os convidados.
 */
export function GalleryManager({ photos }: { photos: Photo[] }) {
  const [state, formAction] = useActionState<SiteState, FormData>(addPhoto, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <LuxeCard className="mt-6">
      <div className="flex items-center gap-2">
        <Images size={18} strokeWidth={1.5} className="text-luxe-gold" />
        <h2 className="font-serif-luxe text-xl text-luxe-cream">
          Galeria de fotos ({photos.length})
        </h2>
      </div>
      <p className="mt-1 text-sm text-luxe-muted">
        As fotos aparecem na seção “Nossos momentos” do site, com carrossel
        ampliado ao clicar. Em breve: upload direto — por enquanto, cole a URL.
      </p>

      <form ref={formRef} action={formAction} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <LuxeLabel htmlFor="p-url">URL da foto</LuxeLabel>
          <LuxeInput id="p-url" name="url" type="url" placeholder="https://..." required />
        </div>
        <div className="flex-1">
          <LuxeLabel htmlFor="p-cap">Legenda (opcional)</LuxeLabel>
          <LuxeInput id="p-cap" name="caption" placeholder="Nosso primeiro encontro..." />
        </div>
        <AddButton />
      </form>

      {state.success && (
        <div className="mt-4 rounded-xl border border-luxe-gold/25 bg-luxe-gold/10 px-4 py-3 text-sm text-luxe-gold">
          Foto adicionada!
        </div>
      )}
      {state.error && (
        <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {photos.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-xl">
              <img
                src={p.url}
                alt={p.caption ?? "Foto da galeria"}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              {p.caption && (
                <p className="absolute inset-x-0 bottom-0 truncate bg-luxe-black/70 px-2 py-1 text-[10px] text-luxe-cream/90">
                  {p.caption}
                </p>
              )}
              <form action={deletePhoto} className="absolute right-1.5 top-1.5">
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  title="Remover foto"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-luxe-black/70 text-luxe-cream/80 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </LuxeCard>
  );
}
