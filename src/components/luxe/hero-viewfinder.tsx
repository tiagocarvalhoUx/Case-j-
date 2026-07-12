"use client";

import { useEffect, useRef } from "react";

/**
 * Overlay "visor de câmera" sobre o hero (estilo apresentação de filmagem):
 *  - cantos de enquadramento (viewfinder) nas 4 pontas;
 *  - indicador ● REC piscando + 4K + timecode rodando (MM:SS:FF a 24fps);
 *  - linha de EXIF da câmera (f/1.4 · ISO 100 · WB 5600K · 50mm).
 *
 * Puramente decorativo (pointer-events-none) — não atrapalha os cliques do
 * conteúdo do hero. O timecode roda via requestAnimationFrame escrevendo
 * direto no DOM (sem re-render do React).
 */

const pad = (n: number) => String(n).padStart(2, "0");

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-5 w-5 border-luxe-gold/50 lg:h-6 lg:w-6 ${className}`}
    />
  );
}

export function HeroViewfinder() {
  const tcRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const elapsed = (t - start) / 1000;
      const frames = Math.floor(elapsed * 24);
      const ff = frames % 24;
      const ss = Math.floor(elapsed) % 60;
      const mm = Math.floor(elapsed / 60) % 60;
      if (tcRef.current) tcRef.current.textContent = `${pad(mm)}:${pad(ss)}:${pad(ff)}`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[15] animate-luxe-in"
      style={{ animationDelay: "0.8s" }}
    >
      {/* Cantos do visor */}
      <Corner className="left-4 top-12 border-l border-t lg:left-10 lg:top-8" />
      <Corner className="right-4 top-12 border-r border-t lg:right-10 lg:top-8" />
      <Corner className="bottom-6 left-4 border-b border-l lg:bottom-8 lg:left-10" />
      <Corner className="bottom-6 right-4 border-b border-r lg:bottom-8 lg:right-10" />

      {/* HUD superior: REC + 4K + timecode  |  EXIF */}
      <div className="absolute left-12 right-12 top-[3.15rem] flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.25em] lg:left-[4.7rem] lg:right-[4.7rem] lg:top-[1.9rem]">
        <div className="flex items-center gap-2 text-luxe-gold">
          <span className="inline-block h-[7px] w-[7px] animate-pulse rounded-full bg-[#e5484d] shadow-[0_0_10px_#e5484d]" />
          REC
          <span className="text-luxe-cream/55">4K</span>
          <span ref={tcRef} className="tabular-nums text-luxe-cream/80">
            00:00:00
          </span>
        </div>
        <div className="hidden text-luxe-cream/55 sm:block">
          f/1.4 · ISO 100 · WB 5600K · 50mm
        </div>
      </div>
    </div>
  );
}
