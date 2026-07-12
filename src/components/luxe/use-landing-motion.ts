"use client";

import { useEffect } from "react";
import { ENTERED_EVENT } from "@/components/luxe/cinematic-intro";

/**
 * Camada cinematográfica de rolagem da landing (client-only):
 *  - smooth scroll com Lenis (escopo só da landing; destruído ao sair);
 *  - parallax no fundo do hero e nas imagens das seções;
 *  - reveal ao rolar para elementos [data-reveal] (sobem + fade);
 *  - contadores animados para [data-count] (com data-suffix opcional).
 *
 * Tudo carregado sob demanda (code-split) e com limpeza completa no unmount.
 * Se as libs não carregarem, o conteúdo permanece visível (fallback seguro).
 */
export function useLandingMotion() {
  useEffect(() => {
    let killed = false;
    let cleanup = () => {};

    (async () => {
      const [gsapMod, stMod, lenisMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (killed) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Lenis = (lenisMod as any).default ?? (lenisMod as any).Lenis;
      gsap.registerPlugin(ScrollTrigger);

      // ---- Smooth scroll (Lenis) integrado ao ticker do GSAP ----
      const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        // ---- Parallax de imagens (leve escala p/ não abrir vãos) ----
        const parallax = (id: string, amount: number) => {
          const el = document.getElementById(id);
          if (!el) return;
          const trigger = el.closest("section") ?? el.parentElement ?? el;
          gsap.set(el, { scale: 1.15, transformOrigin: "center center" });
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        };
        parallax("hero-bg", 5);
        parallax("about-img", 5);
        parallax("cta-bg", 5);

        // ---- Reveal ao rolar ----
        gsap.utils.toArray("[data-reveal]").forEach((el: HTMLElement) => {
          gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        // ---- Contadores animados ----
        gsap.utils.toArray("[data-count]").forEach((el: HTMLElement) => {
          const end = Number(el.getAttribute("data-count")) || 0;
          const suffix = el.getAttribute("data-suffix") || "";
          el.textContent = `0${suffix}`;
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(obj, {
                v: end,
                duration: 1.8,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = `${Math.round(obj.v)}${suffix}`;
                },
              }),
          });
        });

        // ---- Reveal "cinematográfico" de imagens (estilo agência) ----
        // A imagem surge por baixo de uma máscara que abre de cima p/ baixo,
        // enquanto faz um zoom lento assentando (1.3 → 1). Sem tocar no HTML:
        // usamos clip-path (preserva o arredondado) e liberamos o transform no
        // fim para o hover-zoom continuar funcionando.
        gsap.utils.toArray("[data-img-reveal]").forEach((frame: HTMLElement) => {
          const img = frame.querySelector("img") as HTMLElement | null;
          gsap.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });
          if (img) gsap.set(img, { scale: 1.3, transformOrigin: "center center" });
          gsap
            .timeline({
              scrollTrigger: { trigger: frame, start: "top 82%", once: true },
            })
            .to(
              frame,
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.0,
                ease: "power4.inOut",
              },
              0
            )
            .to(
              img,
              {
                scale: 1,
                duration: 1.5,
                ease: "power3.out",
                onComplete: () => img && gsap.set(img, { clearProps: "transform" }),
              },
              0
            );
        });
      });

      // A intro trava o scroll; ao entrar, recalcula posições do ScrollTrigger.
      const onEntered = () => ScrollTrigger.refresh();
      window.addEventListener(ENTERED_EVENT, onEntered);

      cleanup = () => {
        window.removeEventListener(ENTERED_EVENT, onEntered);
        gsap.ticker.remove(tick);
        lenis.destroy();
        ctx.revert();
      };
    })().catch(() => {
      /* libs indisponíveis — conteúdo segue visível (sem animação) */
    });

    return () => {
      killed = true;
      cleanup();
    };
  }, []);
}
