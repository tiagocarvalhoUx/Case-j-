"use client";

import { useEffect, useState } from "react";
import {
  Play,
  ArrowRight,
  ArrowLeft,
  Menu as MenuIcon,
  X,
  Crown,
  CalendarHeart,
  Gift,
  Plane,
  Quote,
  Mail,
  Phone,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LuxeEyebrow,
  luxeButton,
  LuxeArrowLink,
  LuxeOrnament,
} from "@/components/luxe/ui";
import { ReelModal } from "@/components/luxe/reel-modal";
import { GalleryLightbox } from "@/components/luxe/gallery-lightbox";
import { PlansGrid } from "@/components/luxe/plans-grid";
import { CinematicIntro, REPLAY_EVENT } from "@/components/luxe/cinematic-intro";
import { useLandingMotion } from "@/components/luxe/use-landing-motion";
import { HeroViewfinder } from "@/components/luxe/hero-viewfinder";

/* eslint-disable @next/next/no-img-element */

const navItems = [
  { n: "01", id: "inicio", label: "INÍCIO" },
  { n: "02", id: "sobre", label: "SOBRE" },
  { n: "03", id: "servicos", label: "SERVIÇOS" },
  { n: "04", id: "portfolio", label: "PORTFÓLIO" },
  { n: "05", id: "planos", label: "PLANOS" },
  { n: "06", id: "depoimentos", label: "DEPOIMENTOS" },
  { n: "07", id: "contato", label: "CONTATO" },
];

const stats = [
  { num: 12, suffix: "", l1: "ANOS", l2: "DE EXPERIÊNCIA" },
  { num: 320, suffix: "+", l1: "CASAMENTOS", l2: "REALIZADOS" },
  { num: 25, suffix: "", l1: "DESTINOS", l2: "EXCLUSIVOS" },
  { num: 98, suffix: "%", l1: "CLIENTES", l2: "SATISFEITOS" },
];

const services = [
  { icon: Crown, title: "Planejamento completo", desc: "Do conceito à execução, cuidamos de cada detalhe do seu grande dia." },
  { icon: CalendarHeart, title: "Cerimonial & Dia D", desc: "Coordenação impecável para vocês viverem cada momento sem preocupações." },
  { icon: Gift, title: "Lista de presentes", desc: "Presentes que viram dinheiro direto na conta dos noivos, com elegância." },
  { icon: Plane, title: "Cotas de lua de mel", desc: "Seus convidados ajudam a realizar a viagem dos sonhos, cota por cota." },
];

const portfolio = [
  { src: "/background/hero-luxe.jpg", tall: true },
  { src: "/background/wedding-8.jpg", tall: true },
  { src: "/background/wedding-1.jpg", tall: false },
  { src: "/background/wedding-2.jpg", tall: false },
  { src: "/background/wedding-4.jpg", tall: false },
  { src: "/background/wedding-3.jpg", tall: false },
  { src: "/background/wedding-6.avif", tall: false },
];

const testimonials = [
  { quote: "Cada detalhe foi impecável. Recebemos os presentes direto na conta e vivemos um dia de conto de fadas.", author: "Marina & Rafael" },
  { quote: "Sofisticação e tranquilidade do início ao fim. Nossos convidados não param de elogiar.", author: "Beatriz & André" },
  { quote: "A lista de presentes em cotas foi genial. Realizamos a lua de mel dos sonhos.", author: "Camila & Lucas" },
];

function NavList({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-6">
      {navItems.map((it) => {
        const isActive = active === it.id;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            onClick={onNavigate}
            className="group block"
          >
            <span className="flex items-center gap-3 font-serif-luxe text-[11px] tracking-[0.3em] text-luxe-gold/70">
              <span
                className={cn(
                  "h-px transition-all duration-300",
                  isActive
                    ? "w-8 bg-luxe-gold"
                    : "w-4 bg-luxe-gold/40 group-hover:w-8 group-hover:bg-luxe-gold"
                )}
              />
              {it.n}
            </span>
            <span
              className={cn(
                "mt-1 block font-serif-luxe text-sm tracking-[0.3em] transition-colors duration-300",
                isActive ? "text-luxe-gold" : "text-luxe-cream/85 group-hover:text-luxe-gold"
              )}
            >
              {it.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

export function LuxeLanding() {
  useLandingMotion();
  const [open, setOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [active, setActive] = useState("inicio");

  // Scroll-spy: destaca o item do menu conforme a seção visível.
  useEffect(() => {
    const sections = navItems
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex bg-luxe-black font-sans text-luxe-cream">
      {/* ---------- Abertura cinematográfica (uma vez por sessão) ---------- */}
      <CinematicIntro />

      {/* ---------- Sidebar (desktop, fixa) ---------- */}
      <aside className="sticky top-0 z-20 hidden h-screen w-60 shrink-0 flex-col justify-between border-r border-luxe-gold/10 bg-luxe-black px-8 py-9 lg:flex">
        <div>
          <a href="#inicio">
            <img src="/luxe/logo-casaja.png" alt="Case-já — Wedding Planning" className="w-24" />
          </a>
          <div className="mt-14">
            <NavList active={active} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 pt-6">
          <a href="/entrar" className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted transition-colors hover:text-luxe-gold">
            Entrar
          </a>
          <a href="#contato" className="group transition-transform duration-300 hover:scale-[1.04]" aria-label="Fale conosco">
            <img
              src="/luxe/menu.png"
              alt="Menu"
              className="w-24 drop-shadow-[0_0_22px_rgba(212,175,55,0.12)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_34px_rgba(212,175,55,0.3)]"
            />
          </a>
        </div>
      </aside>

      {/* ---------- Header mobile (fixo, posição por viewport) ---------- */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-20 bg-gradient-to-b from-luxe-black/85 to-transparent lg:hidden" />
      <a href="#inicio" className="fixed left-6 top-4 z-40 lg:hidden">
        <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-14" />
      </a>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="fixed right-5 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/50 bg-luxe-black/70 text-luxe-gold transition-colors active:bg-luxe-gold/15 lg:hidden"
      >
        <MenuIcon size={22} strokeWidth={1.5} />
      </button>

      {/* ---------- Main ---------- */}
      <main className="min-w-0 flex-1">
        {/* ===== PRIMEIRA TELA: HERO + STATS ===== */}
        <div className="flex min-h-screen flex-col">
          <section id="inicio" className="relative flex flex-1 flex-col overflow-hidden scroll-mt-20">
            <img
              id="hero-bg"
              src="/background/hero-luxe.jpg"
              alt="Noiva em salão de festas luxuoso"
              className="absolute inset-y-0 right-0 h-full w-full object-cover object-center lg:w-[66%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-luxe-black from-15% via-luxe-black/70 via-45% to-transparent to-75%" />
            <div className="absolute inset-0 bg-luxe-black/12" />
            {/* gradiente inferior forte no mobile para legibilidade */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-luxe-black via-luxe-black/70 to-transparent lg:hidden" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-luxe-black/70 to-transparent lg:block" />

            {/* Visor de câmera (apresentação estilo filmagem) */}
            <HeroViewfinder />

            <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-14 pt-28 sm:px-12 lg:max-w-[54%] lg:justify-center lg:px-16 lg:py-0">
              <div className="flex items-center gap-4 animate-luxe-in" style={{ animationDelay: "0.05s" }}>
                <span className="font-serif-luxe text-sm tracking-[0.45em] text-luxe-gold">CASE-JÁ</span>
                <span className="h-px w-16 bg-luxe-gold/50" />
              </div>

              <h1 className="mt-6 font-serif-luxe font-light leading-[0.92] tracking-[-0.01em]">
                {["Planejamos", "histórias.", "Criamos", "lembranças."].map((word, i) => (
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
                ))}
              </h1>

              <p className="mt-6 max-w-md pr-2 font-serif-luxe text-base leading-relaxed tracking-[0.02em] text-luxe-muted animate-luxe-in sm:mt-8 sm:text-xl" style={{ animationDelay: "0.55s" }}>
                Mais que eventos, criamos emoções inesquecíveis que permanecem para sempre.
              </p>

              <div className="mt-8 flex flex-col gap-6 animate-luxe-in sm:flex-row sm:items-center sm:gap-8 lg:mt-10" style={{ animationDelay: "0.68s" }}>
                <LuxeArrowLink href="/criar">Comece a planejar</LuxeArrowLink>

                {/* PLAY REEL — mobile/tablet (clean) */}
                <button
                  type="button"
                  onClick={() => setReelOpen(true)}
                  className="flex w-fit items-center gap-3 lg:hidden"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-luxe-gold/60 text-luxe-gold transition-transform duration-300 active:scale-95">
                    <Play size={13} strokeWidth={1} className="ml-0.5 fill-luxe-gold" />
                  </span>
                  <span className="font-serif-luxe text-xs tracking-[0.3em] text-luxe-gold">
                    ASSISTIR REEL
                  </span>
                </button>
              </div>
            </div>

            <img
              src="/luxe/flag.png"
              alt="Eventos exclusivos"
              className="absolute right-10 top-0 z-20 hidden w-[92px] transition-[filter] duration-300 hover:drop-shadow-[0_0_26px_rgba(212,175,55,0.4)] sm:block lg:w-[108px]"
            />

            <div className="absolute right-9 top-[34%] z-20 hidden flex-col items-center gap-3 lg:flex">
              <button type="button" onClick={() => setReelOpen(true)} className="font-serif-luxe text-xs tracking-[0.3em] text-luxe-gold transition-colors hover:text-luxe-gold-soft">PLAY REEL</button>
              <button type="button" onClick={() => setReelOpen(true)} aria-label="Assistir reel" className="flex h-14 w-14 items-center justify-center rounded-full border border-luxe-gold/60 transition-all duration-300 hover:scale-[1.08] hover:border-luxe-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                <Play size={15} strokeWidth={1} className="ml-0.5 fill-luxe-gold text-luxe-gold" />
              </button>
            </div>

            <div className="absolute bottom-8 right-9 z-20 hidden items-center gap-6 lg:flex">
              <a href="#depoimentos" aria-label="Anterior" className="text-luxe-cream/60 transition-colors hover:text-luxe-gold">
                <ArrowLeft size={22} strokeWidth={1} />
              </a>
              <span className="font-serif-luxe text-lg tracking-[0.25em]">
                <span className="text-luxe-gold">01</span>
                <span className="text-luxe-cream/50"> / 0{navItems.length}</span>
              </span>
              <a href="#sobre" aria-label="Próximo" className="text-luxe-cream/60 transition-colors hover:text-luxe-gold">
                <ArrowRight size={22} strokeWidth={1} />
              </a>
            </div>
          </section>

          <div className="relative z-10 border-t border-luxe-gold/15 bg-gradient-to-b from-luxe-emerald-3 to-[#041d17]">
            <div className="grid grid-cols-2 divide-x divide-y divide-luxe-gold/12 lg:grid-cols-4 lg:divide-y-0">
              {stats.map((s) => (
                <div key={s.l1} className="flex flex-col items-center px-6 py-9 text-center lg:py-11">
                  <span
                    data-count={s.num}
                    data-suffix={s.suffix}
                    className="font-serif-luxe text-4xl font-light text-luxe-gold lg:text-[2.9rem]"
                  >
                    {s.num}
                    {s.suffix}
                  </span>
                  <span className="mt-3 font-serif-luxe text-xs tracking-[0.3em] text-luxe-cream/90">{s.l1}</span>
                  <span className="font-serif-luxe text-xs tracking-[0.3em] text-luxe-cream/65">{s.l2}</span>
                  <LuxeOrnament className="mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SOBRE ===== */}
        <section id="sobre" className="scroll-mt-20 px-7 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[18px]" data-reveal>
              <img id="about-img" src="/background/wedding-4.jpg" alt="Casamento planejado pela Case-já" className="aspect-[4/5] w-full rounded-[18px] object-cover" />
              <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-luxe-gold/20" />
            </div>
            <div data-reveal>
              <LuxeEyebrow>Sobre nós</LuxeEyebrow>
              <h2 className="mt-6 font-serif-luxe text-4xl font-light leading-tight text-luxe-cream sm:text-5xl">
                Requinte e emoção em <span className="text-luxe-gold">cada detalhe</span>.
              </h2>
              <p className="mt-6 leading-relaxed text-luxe-muted">
                A Case-já nasceu para transformar o planejamento do casamento em
                uma experiência serena e sofisticada. Unimos curadoria impecável,
                tecnologia elegante e um olhar apaixonado por detalhes para que
                vocês vivam apenas o melhor: a emoção.
              </p>
              <p className="mt-4 leading-relaxed text-luxe-muted">
                Do site personalizado à lista de presentes que vira dinheiro na
                conta dos noivos, tudo é pensado para encantar vocês e seus
                convidados.
              </p>
              <LuxeArrowLink href="#servicos" className="mt-8">
                Nossos serviços
              </LuxeArrowLink>
            </div>
          </div>
        </section>

        {/* ===== SERVIÇOS ===== */}
        <section id="servicos" className="scroll-mt-20 border-t border-luxe-gold/10 bg-luxe-panel px-7 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl" data-reveal>
              <LuxeEyebrow>Serviços</LuxeEyebrow>
              <h2 className="mt-6 font-serif-luxe text-4xl font-light text-luxe-cream sm:text-5xl">
                Uma experiência completa, do sim ao adeus.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.title} data-reveal className="group flex gap-5 rounded-[18px] border border-luxe-gold/12 bg-luxe-card/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-luxe-gold/25 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)]">
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-luxe-gold/25 text-luxe-gold transition-colors group-hover:bg-luxe-gold group-hover:text-luxe-black">
                    <s.icon size={22} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-serif-luxe text-xl text-luxe-cream">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-luxe-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PORTFÓLIO ===== */}
        <section id="portfolio" className="scroll-mt-20 px-7 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center" data-reveal>
              <div className="flex justify-center">
                <LuxeEyebrow>Portfólio</LuxeEyebrow>
              </div>
              <h2 className="mt-6 font-serif-luxe text-4xl font-light text-luxe-cream sm:text-5xl">
                Momentos que viraram eternidade.
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
              {portfolio.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  data-img-reveal
                  onClick={() => setLightbox(i)}
                  aria-label={`Ampliar foto ${i + 1} do portfólio`}
                  className={cn(
                    "group relative cursor-zoom-in overflow-hidden rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxe-gold",
                    item.tall && "md:row-span-2",
                    i === 0 && "col-span-2 md:col-span-1"
                  )}
                >
                  <img
                    src={item.src}
                    alt="Casamento Case-já"
                    loading="lazy"
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                      item.tall ? "aspect-[3/4] md:aspect-auto md:h-full" : "aspect-square"
                    )}
                  />
                  <div className="absolute inset-0 bg-luxe-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-luxe-gold/15" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PLANOS ===== */}
        <section id="planos" className="scroll-mt-20 px-7 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center" data-reveal>
              <div className="flex justify-center">
                <LuxeEyebrow>Planos & preços</LuxeEyebrow>
              </div>
              <h2 className="mt-6 font-serif-luxe text-4xl font-light text-luxe-cream sm:text-5xl">
                Comece grátis. Pague só quando pedir mais.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-luxe-muted">
                Todo casal começa com <span className="text-luxe-cream">7 dias
                de Premium liberado</span>. A maior parte da nossa receita vem de
                uma pequena taxa sobre os presentes — não da mensalidade.
              </p>
            </div>
            <div className="mt-14">
              <PlansGrid />
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-luxe-muted/70">
              A taxa de presente é descontada automaticamente de cada presente
              recebido — quanto melhor o plano, menor a taxa. Você pode repassar
              essa taxa ao convidado ou assumi-la, como preferir.
            </p>
          </div>
        </section>

        {/* ===== DEPOIMENTOS ===== */}
        <section id="depoimentos" className="scroll-mt-20 border-t border-luxe-gold/10 bg-luxe-panel px-7 py-24 sm:px-12 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center" data-reveal>
              <div className="flex justify-center">
                <LuxeEyebrow>Depoimentos</LuxeEyebrow>
              </div>
              <h2 className="mt-6 font-serif-luxe text-4xl font-light text-luxe-cream sm:text-5xl">
                O que os casais dizem.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.author} data-reveal className="rounded-[18px] border border-luxe-gold/12 bg-luxe-card/70 p-8">
                  <Quote size={26} className="text-luxe-gold/50" />
                  <p className="mt-4 font-serif-luxe text-lg italic leading-relaxed text-luxe-cream/90">
                    “{t.quote}”
                  </p>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-luxe-gold">{t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTATO ===== */}
        <section id="contato" className="relative scroll-mt-20 overflow-hidden px-7 py-28 sm:px-12 lg:px-20 lg:py-36">
          <img id="cta-bg" src="/background/wedding-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-luxe-black/85" />
          <div className="relative mx-auto max-w-2xl text-center" data-reveal>
            <div className="flex justify-center">
              <LuxeOrnament className="w-24" />
            </div>
            <h2 className="mt-6 font-serif-luxe text-4xl font-light leading-tight text-luxe-cream sm:text-5xl">
              Vamos planejar o casamento dos <span className="text-luxe-gold">seus sonhos</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-luxe-muted">
              Crie seu site em minutos e comece a receber os presentes. É grátis
              para começar.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/criar" className={luxeButton({ size: "lg" })}>
                Comece a planejar <ArrowRight size={16} strokeWidth={1.5} />
              </a>
              <a href="/entrar" className="text-[11px] uppercase tracking-[0.25em] text-luxe-cream/70 transition-colors hover:text-luxe-gold">
                Já tenho conta
              </a>
            </div>
            <div className="mt-12 flex flex-col items-center justify-center gap-x-10 gap-y-3 text-sm text-luxe-muted sm:flex-row">
              <a href="mailto:contato@case-ja.com.br" className="inline-flex items-center gap-2 hover:text-luxe-gold">
                <Mail size={15} strokeWidth={1.5} /> contato@case-ja.com.br
              </a>
              <a
                href="https://wa.me/5518981142927?text=Ol%C3%A1!%20Quero%20planejar%20meu%20casamento%20com%20o%20Case-j%C3%A1%20%F0%9F%92%8D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-luxe-gold"
              >
                <Phone size={15} strokeWidth={1.5} /> (18) 98114-2927
              </a>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-luxe-gold/10 bg-luxe-black px-7 py-10 sm:px-12 lg:px-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-16" />
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}
              className="inline-flex items-center gap-2 rounded-full border border-luxe-gold/35 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-luxe-gold transition-colors hover:bg-luxe-gold hover:text-luxe-black"
            >
              <RotateCcw size={13} strokeWidth={1.5} /> Rever intro
            </button>
            <p className="text-[11px] uppercase tracking-[0.2em] text-luxe-muted/70">
              © {new Date().getFullYear()} Case-já · Todos os direitos reservados
            </p>
          </div>
        </footer>
      </main>

      {/* ---------- Drawer (mobile) ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-luxe-black/97 px-8 py-7 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between">
            <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-20" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="text-luxe-gold">
              <X size={26} strokeWidth={1.5} />
            </button>
          </div>
          <div className="mt-14">
            <NavList active={active} onNavigate={() => setOpen(false)} />
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <a href="/entrar" onClick={() => setOpen(false)} className="text-[11px] uppercase tracking-[0.25em] text-luxe-muted">
              Entrar
            </a>
            <a href="/criar" onClick={() => setOpen(false)} className="inline-flex items-center gap-3 font-serif-luxe text-sm uppercase tracking-[0.3em] text-luxe-gold">
              Comece a planejar <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}

      {/* Modal do reel */}
      <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} />

      {/* Lightbox do portfólio */}
      <GalleryLightbox
        images={portfolio.map((p) => p.src)}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </div>
  );
}
