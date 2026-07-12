"use client";

import { useEffect, useRef } from "react";

/**
 * Vídeo de fundo do hero (completa o efeito "câmera gravando" do visor).
 *  - autoplay mudo em loop, inline (funciona no iOS/Android);
 *  - `poster` = a foto do hero, que aparece na hora e serve de fallback
 *    caso o vídeo não possa tocar;
 *  - id="hero-bg" para o parallax do useLandingMotion agir sobre ele.
 *
 * O `muted` é reforçado via ref porque o React nem sempre reflete o atributo
 * a tempo, o que faria o navegador bloquear o autoplay.
 */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        /* autoplay bloqueado — o poster (foto) permanece visível */
      });
    }
  }, []);

  return (
    <video
      ref={ref}
      id="hero-bg"
      poster="/background/hero-luxe.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      className={className}
    >
      <source src="/reel.mp4" type="video/mp4" />
    </video>
  );
}
