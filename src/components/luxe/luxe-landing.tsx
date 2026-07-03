"use client";

import { useState } from "react";
import { Play, ArrowRight, ArrowLeft, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { n: "01", label: "HOME", href: "/", active: true },
  { n: "02", label: "ABOUT", href: "#" },
  { n: "03", label: "SERVICES", href: "#" },
  { n: "04", label: "PORTFOLIO", href: "#" },
  { n: "05", label: "JOURNAL", href: "#" },
  { n: "06", label: "CONTACT", href: "#" },
];

const stats = [
  { value: "12", l1: "ANOS", l2: "DE EXPERIÊNCIA" },
  { value: "320+", l1: "CASAMENTOS", l2: "REALIZADOS" },
  { value: "25", l1: "DESTINOS", l2: "EXCLUSIVOS" },
  { value: "98%", l1: "CLIENTES", l2: "SATISFEITOS" },
];

/* eslint-disable @next/next/no-img-element */

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-7">
      {navItems.map((it, i) => (
        <a
          key={it.label}
          href={it.href}
          onClick={onNavigate}
          className="group block animate-luxe-in"
          style={{ animationDelay: `${0.15 + i * 0.06}s` }}
        >
          <span className="flex items-center gap-3 font-serif-luxe text-[11px] tracking-[0.3em] text-luxe-gold/70">
            <span
              className={cn(
                "h-px transition-all duration-300",
                it.active
                  ? "w-8 bg-luxe-gold"
                  : "w-4 bg-luxe-gold/40 group-hover:w-8 group-hover:bg-luxe-gold"
              )}
            />
            {it.n}
          </span>
          <span
            className={cn(
              "mt-1.5 block font-serif-luxe text-sm tracking-[0.35em] transition-colors duration-300",
              it.active
                ? "text-luxe-gold"
                : "text-luxe-cream/85 group-hover:text-luxe-gold"
            )}
          >
            {it.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

export function LuxeLanding() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-luxe-black font-sans text-luxe-cream">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="relative z-20 hidden w-60 shrink-0 flex-col justify-between border-r border-luxe-gold/10 bg-luxe-black px-8 py-9 lg:flex">
        <div>
          <img
            src="/luxe/logo-casaja.png"
            alt="Case-já — Wedding Planning"
            className="w-24 animate-luxe-in"
          />
          <div className="mt-16">
            <NavList />
          </div>
        </div>
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="group transition-transform duration-300 hover:scale-[1.04]"
          >
            <img
              src="/luxe/menu.png"
              alt="Menu"
              className="w-28 drop-shadow-[0_0_22px_rgba(212,175,55,0.12)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_34px_rgba(212,175,55,0.3)]"
            />
          </button>
        </div>
      </aside>

      {/* ---------- Top bar (mobile) ---------- */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 lg:hidden">
        <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-14" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="text-luxe-gold"
        >
          <MenuIcon size={26} strokeWidth={1.5} />
        </button>
      </div>

      {/* ---------- Main ---------- */}
      <main className="relative flex min-h-screen flex-1 flex-col">
        {/* HERO */}
        <section className="relative flex flex-1 flex-col overflow-hidden">
          {/* Foto cinematográfica */}
          <img
            src="/background/hero-luxe.jpg"
            alt="Noiva em salão de festas luxuoso"
            className="absolute inset-y-0 right-0 h-full w-full object-cover object-center lg:w-[66%]"
          />
          {/* Overlays: escurece a esquerda (título) e dá clima cinematográfico */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxe-black from-15% via-luxe-black/70 via-45% to-transparent to-75%" />
          <div className="absolute inset-0 bg-luxe-black/12" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-luxe-black/70 to-transparent" />

          {/* Conteúdo (esquerda) */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-7 pt-24 pb-16 sm:px-12 lg:max-w-[54%] lg:px-16 lg:py-0">
            <div
              className="flex items-center gap-4 animate-luxe-in"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="font-serif-luxe text-sm tracking-[0.45em] text-luxe-gold">
                CASE-JÁ
              </span>
              <span className="h-px w-16 bg-luxe-gold/50" />
            </div>

            <h1 className="mt-6 font-serif-luxe font-light leading-[0.92] tracking-[-0.01em]">
              {["Planejamos", "histórias.", "Criamos", "lembranças."].map(
                (word, i) => (
                  <span
                    key={word}
                    className={cn(
                      "block animate-luxe-in text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]",
                      i < 2 ? "text-luxe-cream" : "text-luxe-gold"
                    )}
                    style={{ animationDelay: `${0.12 + i * 0.09}s` }}
                  >
                    {word}
                  </span>
                )
              )}
            </h1>

            <p
              className="mt-8 max-w-md font-serif-luxe text-lg leading-relaxed tracking-[0.02em] text-luxe-muted animate-luxe-in sm:text-xl"
              style={{ animationDelay: "0.55s" }}
            >
              Mais que eventos, criamos emoções inesquecíveis que permanecem para
              sempre.
            </p>

            <a
              href="/criar"
              className="group mt-10 inline-flex w-fit items-center gap-4 animate-luxe-in"
              style={{ animationDelay: "0.68s" }}
            >
              <span className="font-serif-luxe text-sm tracking-[0.3em] text-luxe-gold transition-colors duration-300 group-hover:text-luxe-gold-soft">
                COMECE A PLANEJAR
              </span>
              <span className="flex items-center">
                <span className="h-px w-12 bg-luxe-gold transition-all duration-300 group-hover:w-20 group-hover:bg-luxe-gold-soft" />
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="-ml-1 text-luxe-gold transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </a>
          </div>

          {/* Badge (pennant) */}
          <img
            src="/luxe/flag.png"
            alt="Eventos exclusivos"
            className="absolute right-10 top-0 z-20 hidden w-[92px] transition-[filter] duration-300 hover:drop-shadow-[0_0_26px_rgba(212,175,55,0.4)] sm:block lg:w-[108px]"
          />

          {/* Play reel */}
          <div className="absolute right-9 top-[34%] z-20 hidden flex-col items-center gap-3 lg:flex">
            <span className="font-serif-luxe text-xs tracking-[0.3em] text-luxe-gold">
              PLAY REEL
            </span>
            <button
              type="button"
              aria-label="Assistir reel"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-luxe-gold/60 transition-all duration-300 hover:scale-[1.08] hover:border-luxe-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]"
            >
              <Play size={15} strokeWidth={1} className="ml-0.5 fill-luxe-gold text-luxe-gold" />
            </button>
          </div>

          {/* Slider */}
          <div className="absolute bottom-8 right-9 z-20 hidden items-center gap-6 lg:flex">
            <button
              type="button"
              aria-label="Anterior"
              className="text-luxe-cream/60 transition-colors hover:text-luxe-gold"
            >
              <ArrowLeft size={22} strokeWidth={1} />
            </button>
            <span className="font-serif-luxe text-lg tracking-[0.25em]">
              <span className="text-luxe-gold">01</span>
              <span className="text-luxe-cream/50"> / 06</span>
            </span>
            <button
              type="button"
              aria-label="Próximo"
              className="text-luxe-cream/60 transition-colors hover:text-luxe-gold"
            >
              <ArrowRight size={22} strokeWidth={1} />
            </button>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="relative z-10 border-t border-luxe-gold/15 bg-gradient-to-b from-luxe-emerald-3 to-[#041d17]">
          <div className="grid grid-cols-2 divide-x divide-y divide-luxe-gold/12 lg:grid-cols-4 lg:divide-y-0">
            {stats.map((s) => (
              <div
                key={s.value}
                className="flex flex-col items-center px-6 py-9 text-center lg:py-11"
              >
                <span className="font-serif-luxe text-4xl font-light text-luxe-gold lg:text-[2.9rem]">
                  {s.value}
                </span>
                <span className="mt-3 font-serif-luxe text-xs tracking-[0.3em] text-luxe-cream/90">
                  {s.l1}
                </span>
                <span className="font-serif-luxe text-xs tracking-[0.3em] text-luxe-cream/65">
                  {s.l2}
                </span>
                <img
                  src="/luxe/ornament.png"
                  alt=""
                  className="mt-4 w-16 opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ---------- Drawer (mobile) ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-luxe-black/97 px-8 py-7 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between">
            <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-20" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="text-luxe-gold"
            >
              <X size={26} strokeWidth={1.5} />
            </button>
          </div>
          <div className="mt-16">
            <NavList onNavigate={() => setOpen(false)} />
          </div>
          <a
            href="/criar"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex items-center gap-3 font-serif-luxe text-sm tracking-[0.3em] text-luxe-gold"
          >
            COMECE A PLANEJAR
            <ArrowRight size={16} strokeWidth={1.5} />
          </a>
        </div>
      )}
    </div>
  );
}
