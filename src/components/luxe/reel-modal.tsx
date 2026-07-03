"use client";

import { useEffect, useRef, useState } from "react";
import { X, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

/**
 * ============================================================
 * CONFIGURE AQUI O SEU REEL
 * - REEL_VIDEO: link do YouTube/Vimeo OU caminho de um .mp4 em /public
 *   (ex.: "/reel.mp4"). Deixe "" para usar a montagem automática das fotos.
 * - REEL_MUSIC: caminho de um .mp3 em /public para a trilha da montagem
 *   (ex.: "/reel-music.mp3"). Deixe "" para sem música.
 * ============================================================
 */
const REEL_VIDEO = "/reel.mp4";
const REEL_MUSIC = "";

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
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFull, setIsFull] = useState(false);
  const [muted, setMuted] = useState(false);

  const embed = REEL_VIDEO ? parseEmbed(REEL_VIDEO) : null;
  const isMp4 = REEL_VIDEO.toLowerCase().endsWith(".mp4");
  const isMontage = !embed && !isMp4;
  const hasMusic = isMontage && Boolean(REEL_MUSIC);

  // ESC + trava de scroll
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

  // Sincroniza estado de tela cheia
  useEffect(() => {
    const onFs = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Toca a trilha ao abrir (o clique em PLAY REEL é o gesto do usuário)
  useEffect(() => {
    if (open && hasMusic && audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {});
    }
  }, [open, hasMusic]);

  if (!open) return null;

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else contentRef.current?.requestFullscreen().catch(() => {});
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
    if (!a.muted && a.paused) a.play().catch(() => {});
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reel do Case-já"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-luxe-black/90 p-4 backdrop-blur-md animate-fade-up sm:p-8"
    >
      {/* Controles */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        {hasMusic && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={muted ? "Ativar som" : "Silenciar"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/30 text-luxe-gold transition-colors hover:border-luxe-gold hover:bg-luxe-gold hover:text-luxe-black"
          >
            {muted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFull();
          }}
          aria-label={isFull ? "Sair da tela cheia" : "Tela cheia"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/30 text-luxe-gold transition-colors hover:border-luxe-gold hover:bg-luxe-gold hover:text-luxe-black"
        >
          {isFull ? <Minimize2 size={18} strokeWidth={1.5} /> : <Maximize2 size={18} strokeWidth={1.5} />}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/30 text-luxe-gold transition-colors hover:border-luxe-gold hover:bg-luxe-gold hover:text-luxe-black"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div
        ref={contentRef}
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
        {hasMusic && <audio ref={audioRef} src={REEL_MUSIC} loop preload="auto" />}
      </div>
    </div>
  );
}
