"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Abertura cinematográfica do Case-já.
 *
 * Uma "cortina" dourada/preta que revela a marca e, ao entrar, sobe/desce
 * descortinando a landing. Práticas aplicadas:
 *  - toca uma vez por sessão (sessionStorage) — não incomoda quem volta;
 *  - pode ser revista a qualquer momento (evento `caseja:replay-intro`);
 *  - avisa quando termina (evento `caseja:entered`) p/ recalcular o scroll;
 *  - é pulável (botão, ESC, clique) e sempre libera o scroll ao final;
 *  - acessível: dialog modal, foco no CTA e movido ao conteúdo no fim;
 *  - GSAP carregado sob demanda (code-split), com fallback estático.
 *
 * Observação: por ser a vitrine de marketing, a abertura toca mesmo com
 * "menos movimento" ligado no SO (decisão de produto, não acessibilidade).
 */

const SEEN_KEY = "caseja_intro_seen";
export const REPLAY_EVENT = "caseja:replay-intro";
export const ENTERED_EVENT = "caseja:entered";

export function CinematicIntro() {
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const enteringRef = useRef(false);
  const prevOverflowRef = useRef<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gsapRef = useRef<any>(null);

  const lockScroll = useCallback(() => {
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }, []);

  const finish = useCallback(() => {
    document.body.style.overflow = prevOverflowRef.current;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* sessionStorage indisponível — sem problema */
    }
    setVisible(false);
    window.dispatchEvent(new Event(ENTERED_EVENT));
    // Move o foco para o conteúdo (continuidade p/ teclado e leitores de tela).
    requestAnimationFrame(() => {
      const main = document.querySelector("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        (main as HTMLElement).focus({ preventScroll: true });
      }
    });
  }, []);

  const enter = useCallback(() => {
    if (enteringRef.current) return;
    enteringRef.current = true;
    const gsap = gsapRef.current;

    if (!gsap) {
      finish();
      return;
    }
    gsap
      .timeline({ onComplete: finish })
      .to(innerRef.current, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
      .set(overlayRef.current, { backgroundColor: "transparent" })
      .to(topRef.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "curtain")
      .to(botRef.current, { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "curtain");
  }, [finish]);

  // Pula na 1ª pintura só se já foi vista nesta sessão; senão trava o scroll.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) {
      setVisible(false);
      return;
    }
    lockScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Permite "Rever intro" a qualquer momento (botão do rodapé).
  useEffect(() => {
    const onReplay = () => {
      try {
        sessionStorage.removeItem(SEEN_KEY);
      } catch {
        /* ignore */
      }
      enteringRef.current = false;
      gsapRef.current = null;
      lockScroll();
      setVisible(true);
    };
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_EVENT, onReplay);
  }, [lockScroll]);

  // Carrega o GSAP e roda o reveal da marca.
  useEffect(() => {
    if (!visible) return;
    let mounted = true;

    import("gsap")
      .then((mod) => {
        if (!mounted) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gsap = (mod as any).gsap ?? (mod as any).default;
        gsapRef.current = gsap;

        gsap.set([topRef.current, botRef.current], { yPercent: 0 });
        gsap.set(overlayRef.current, { backgroundColor: "" });
        gsap.set(innerRef.current, { opacity: 0, y: 14 });
        gsap.set(lineRef.current, { width: 0 });
        gsap.to(innerRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.25,
        });
        gsap.to(lineRef.current, {
          width: 210,
          duration: 1.2,
          ease: "power2.inOut",
          delay: 0.6,
          onComplete: () => btnRef.current?.focus({ preventScroll: true }),
        });
      })
      .catch(() => {
        // Sem GSAP: mostra a marca estática (o clique ainda revela a landing).
        if (innerRef.current) {
          innerRef.current.style.opacity = "1";
          innerRef.current.style.transform = "none";
        }
        if (lineRef.current) lineRef.current.style.width = "210px";
      });

    return () => {
      mounted = false;
    };
  }, [visible]);

  // Teclado: ESC/Enter/Espaço entram; garante liberar o scroll ao desmontar.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " ", "Spacebar"].includes(e.key)) {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [visible, enter]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Introdução Case-já"
      onClick={enter}
      className="fixed inset-0 z-[9999] overflow-hidden bg-luxe-black"
    >
      {/* Cortinas (sobem/descem para revelar) */}
      <div ref={topRef} className="absolute inset-x-0 top-0 z-[1] h-[51vh] bg-luxe-black" />
      <div ref={botRef} className="absolute inset-x-0 bottom-0 z-[1] h-[51vh] bg-luxe-black" />

      {/* Grão sutil de filme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #fff 0, transparent 40%), radial-gradient(circle at 80% 70%, #fff 0, transparent 40%)",
        }}
      />
      {/* Vinheta radial para profundidade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent, rgba(0,0,0,0.6))",
        }}
      />

      {/* Marca + CTA */}
      <div
        ref={innerRef}
        className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center opacity-0"
      >
        <div className="font-serif-luxe text-5xl font-medium tracking-[0.28em] text-luxe-cream sm:text-6xl md:text-7xl">
          CASE<span className="text-luxe-gold">·</span>JÁ
        </div>

        <span
          ref={lineRef}
          aria-hidden
          className="my-6 block h-px w-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-luxe-gold, #D4AF37), transparent)",
          }}
        />

        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-luxe-muted sm:text-xs">
          Planejamos histórias · Criamos lembranças
        </p>

        <button
          ref={btnRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            enter();
          }}
          className="group mt-11 inline-flex items-center gap-3.5 rounded-full border border-luxe-gold/40 px-8 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-luxe-cream transition-all duration-500 ease-out hover:border-luxe-gold hover:bg-luxe-gold hover:tracking-[0.34em] hover:text-luxe-black"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-luxe-gold shadow-[0_0_12px_var(--color-luxe-gold,#D4AF37)] transition-shadow group-hover:bg-luxe-black group-hover:shadow-none" />
          Começar experiência
        </button>

        <p className="mt-5 text-[0.64rem] uppercase tracking-[0.22em] text-luxe-muted/60">
          Uma abertura cinematográfica · role após entrar
        </p>
      </div>

      {/* Pular (respeito ao tempo do usuário) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          enter();
        }}
        className="absolute right-5 top-5 z-[4] text-[0.6rem] uppercase tracking-[0.25em] text-luxe-muted/70 transition-colors hover:text-luxe-gold"
      >
        Pular
      </button>
    </div>
  );
}
