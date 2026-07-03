"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fundo do hero: carrossel de fotos em crossfade (estilo iCasei), controlado
 * por JavaScript para garantir a troca mesmo quando o sistema está com
 * "reduzir movimento" (nesse caso a troca é instantânea, sem fade/zoom).
 */
const images = [
  "/background/wedding-1.png",
  "/background/wedding-2.png",
  "/background/wedding-4.png",
  "/background/wedding-3.png",
  "/background/wedding-6.avif",
  "/background/wedding-5.avif",
];

const INTERVAL = 9000; // 9s por foto (troca lenta e suave)

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-navy-950">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out will-change-[opacity,transform]",
            i === index ? "opacity-100" : "opacity-0"
          )}
          style={
            i === index
              ? { animation: "ken-burns 12s ease-out forwards" }
              : undefined
          }
        />
      ))}

      {/* Overlays para contraste do texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-900/65 to-navy-900/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/20" />
    </div>
  );
}
