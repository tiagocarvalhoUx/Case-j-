"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

/**
 * Lightbox com carrossel suave para galerias (estilo luxury):
 * - crossfade + leve zoom a cada troca
 * - setas, contador 01/07, teclado (←/→/ESC), swipe no mobile
 * - clique fora fecha; trava o scroll da página
 */
export function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const touchX = useRef<number | null>(null);
  const [entered, setEntered] = useState(false);

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  // Teclado + trava de scroll
  useEffect(() => {
    if (!open) return;
    setEntered(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      setEntered(false);
    };
  }, [open, onClose, prev, next]);

  if (!open || index === null) return null;

  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/40 text-luxe-gold transition-all duration-300 hover:border-luxe-gold hover:bg-luxe-gold hover:text-luxe-black";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 48) (dx > 0 ? prev() : next());
      }}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-luxe-black/93 backdrop-blur-md transition-opacity duration-300",
        entered ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Fechar */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar galeria"
        className={cn(btn, "absolute right-5 top-5 z-10")}
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {/* Imagem (key={index} remonta com animação suave) */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[86vh] max-w-[92vw] items-center justify-center lg:max-w-[80vw]"
      >
        <img
          key={index}
          src={images[index]}
          alt={`Foto ${index + 1} de ${images.length}`}
          className="max-h-[86vh] max-w-full rounded-[14px] object-contain shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-luxe-gold/20 animate-lightbox-in"
        />
      </figure>

      {/* Pré-carrega vizinhas para a troca ser instantânea */}
      <link rel="preload" as="image" href={images[(index + 1) % images.length]} />
      <link rel="preload" as="image" href={images[(index - 1 + images.length) % images.length]} />

      {/* Navegação */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Foto anterior"
        className={cn(btn, "absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-6")}
      >
        <ChevronLeft size={22} strokeWidth={1.25} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Próxima foto"
        className={cn(btn, "absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-6")}
      >
        <ChevronRight size={22} strokeWidth={1.25} />
      </button>

      {/* Contador */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif-luxe text-sm tracking-[0.3em]">
        <span className="text-luxe-gold">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-luxe-cream/50"> / {String(images.length).padStart(2, "0")}</span>
      </p>
    </div>
  );
}
