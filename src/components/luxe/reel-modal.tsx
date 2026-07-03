"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

/**
 * ============================================================
 * CONFIGURE AQUI O SEU REEL
 * - Cole um link do YouTube ou Vimeo, OU o caminho de um .mp4 em /public
 *   (ex.: "/reel.mp4"). Deixe "" para usar a montagem automática das fotos.
 * ============================================================
 */
const REEL_VIDEO = "";

/** Fotos usadas na montagem automática (fallback sem vídeo). */
const MONTAGE = [
  "/background/hero-luxe.jpg",
  "/background/wedding-1.png",
  "/background/wedding-4.png",
  "/background/wedding-2.png",
  "/background/wedding-3.png",
  "/background/wedding-6.avif",
];

function parseEmbed(url: string): string | null {
  try {
    const u = new URL(url, "https://x");
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function Montage() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MONTAGE.length), 3800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-full w-full overflow-hidden bg-luxe-black">
      {MONTAGE.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out",
            idx === i ? "opacity-100" : "opacity-0"
          )}
          style={idx === i ? { animation: "ken-burns 8s ease-out forwards" } : undefined}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-luxe-black/80 via-transparent to-luxe-black/30" />
      <div className="absolute inset-x-0 bottom-0 p-8 text-center sm:p-12">
        <p className="font-serif-luxe text-xs uppercase tracking-[0.5em] text-luxe-gold">
          Case-já
        </p>
        <p className="mt-3 font-serif-luxe text-2xl font-light text-luxe-cream sm:text-3xl">
          Planejamos histórias. Criamos lembranças.
        </p>
      </div>
    </div>
  );
}

export function ReelModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const embed = REEL_VIDEO ? parseEmbed(REEL_VIDEO) : null;
  const isMp4 = REEL_VIDEO.toLowerCase().endsWith(".mp4");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reel do Case-já"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-luxe-black/90 p-4 backdrop-blur-md animate-fade-up sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/30 text-luxe-gold transition-colors hover:border-luxe-gold hover:bg-luxe-gold hover:text-luxe-black"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl overflow-hidden rounded-[18px] border border-luxe-gold/20 bg-luxe-black shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      >
        <div className="relative aspect-video w-full">
          {embed ? (
            <iframe
              src={embed}
              title="Reel"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : isMp4 ? (
            <video src={REEL_VIDEO} controls autoPlay className="absolute inset-0 h-full w-full bg-black" />
          ) : (
            <Montage />
          )}
        </div>
      </div>
    </div>
  );
}
