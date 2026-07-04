"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/luxe/gallery-lightbox";
import type { Photo } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

/**
 * Galeria de fotos do casal no site público: grid + lightbox com carrossel.
 */
export function WeddingGallery({
  photos,
  light,
}: {
  photos: Photo[];
  light: boolean;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setLightbox(i)}
            aria-label={p.caption ? `Ampliar foto: ${p.caption}` : `Ampliar foto ${i + 1}`}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2",
              light ? "focus-visible:outline-[#9a7325]" : "focus-visible:outline-luxe-gold"
            )}
          >
            <img
              src={p.url}
              alt={p.caption ?? "Foto do casal"}
              loading="lazy"
              className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-luxe-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset",
                light ? "ring-black/10" : "ring-luxe-gold/15"
              )}
            />
          </button>
        ))}
      </div>

      <GalleryLightbox
        images={photos.map((p) => p.url)}
        captions={photos.map((p) => p.caption)}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </>
  );
}
