"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Images, Upload, Link2 } from "lucide-react";
import { addPhoto, deletePhoto, type SiteState } from "./actions";
import { createClient } from "@/lib/supabase/client";
import type { Photo } from "@/lib/supabase/types";
import { LuxeCard, LuxeButton, LuxeInput, LuxeLabel } from "@/components/luxe/ui";

/* eslint-disable @next/next/no-img-element */

/**
 * Comprime a imagem no navegador (máx. 1600px, JPEG q0.85) antes do upload:
 * fotos de celular caem de ~8MB para ~200KB sem perda visível.
 */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("falha ao processar"))),
      "image/jpeg",
      0.85
    )
  );
}

function AddUrlButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" variant="outline" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
      Adicionar
    </LuxeButton>
  );
}

export function GalleryManager({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const [state, formAction] = useActionState<SiteState, FormData>(addPhoto, {});
  const urlFormRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (state.success) urlFormRef.current?.reset();
  }, [state]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadMsg(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada — entre novamente.");

      let enviados = 0;
      for (const file of Array.from(files).slice(0, 10)) {
        if (!file.type.startsWith("image/")) continue;

        let blob: Blob;
        try {
          blob = await compressImage(file);
        } catch {
          throw new Error(
            `"${file.name}" não é suportado — use fotos JPG, PNG ou WebP.`
          );
        }

        const path = `${user.id}/${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("photos")
          .upload(path, blob, { contentType: "image/jpeg" });
        if (upErr) throw new Error(upErr.message);

        const { data: pub } = supabase.storage.from("photos").getPublicUrl(path);

        const fd = new FormData();
        fd.set("url", pub.publicUrl);
        fd.set("caption", caption);
        const res = await addPhoto({}, fd);
        if (res.error) throw new Error(res.error);
        enviados++;
      }

      setUploadMsg({
        ok: true,
        text: enviados > 1 ? `${enviados} fotos enviadas!` : "Foto enviada!",
      });
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (e) {
      setUploadMsg({
        ok: false,
        text: e instanceof Error ? e.message : "Não foi possível enviar a foto.",
      });
    } finally {
      setUploading(false);
    }
  }

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
        ampliado ao clicar.
      </p>

      {/* Upload direto */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <LuxeLabel htmlFor="up-cap">Legenda (opcional, vale para o envio)</LuxeLabel>
          <LuxeInput
            id="up-cap"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nosso ensaio pré-wedding..."
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <LuxeButton
          type="button"
          size="lg"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Enviando...
            </>
          ) : (
            <>
              <Upload size={16} strokeWidth={1.5} /> Enviar fotos
            </>
          )}
        </LuxeButton>
      </div>
      <p className="mt-2 text-[11px] text-luxe-muted/70">
        Até 10 fotos por vez (JPG, PNG ou WebP). Nós comprimimos automaticamente
        para o site carregar rápido.
      </p>

      {uploadMsg && (
        <div
          className={
            uploadMsg.ok
              ? "mt-4 rounded-xl border border-luxe-gold/25 bg-luxe-gold/10 px-4 py-3 text-sm text-luxe-gold"
              : "mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          }
        >
          {uploadMsg.text}
        </div>
      )}

      {/* Ou por URL */}
      <details className="mt-5">
        <summary className="flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:text-luxe-gold">
          <Link2 size={13} /> Ou adicionar por URL
        </summary>
        <form
          ref={urlFormRef}
          action={formAction}
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <LuxeLabel htmlFor="p-url">URL da foto</LuxeLabel>
            <LuxeInput id="p-url" name="url" type="url" placeholder="https://..." required />
          </div>
          <div className="flex-1">
            <LuxeLabel htmlFor="p-cap">Legenda (opcional)</LuxeLabel>
            <LuxeInput id="p-cap" name="caption" placeholder="Nosso primeiro encontro..." />
          </div>
          <AddUrlButton />
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
      </details>

      {/* Miniaturas */}
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
