import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Gift, Plane, Heart, PiggyBank } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LuxeOrnament } from "@/components/luxe/ui";
import { cn } from "@/lib/utils";
import type { Gift as GiftRow, Wedding } from "@/lib/supabase/types";

/* eslint-disable @next/next/no-img-element */

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function daysUntil(date: string | null) {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

async function getWedding(slug: string): Promise<Wedding | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("weddings").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  if (!wedding) return { title: "Casamento não encontrado" };
  return {
    title: `${wedding.couple_names} · Casamento`,
    description:
      wedding.welcome_message ??
      `Site do casamento de ${wedding.couple_names}. Confirme presença e escolha um presente.`,
  };
}

const giftIcon = (category: string | null) => {
  if (category?.toLowerCase().includes("lua")) return Plane;
  if (category?.toLowerCase().includes("cota")) return PiggyBank;
  return Gift;
};

export default async function PublicWeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  if (!wedding) notFound();

  const supabase = await createClient();
  const { data: giftsData } = await supabase
    .from("gifts")
    .select("*")
    .eq("wedding_id", wedding.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });
  const gifts = (giftsData ?? []) as GiftRow[];

  const dateLabel = formatDate(wedding.wedding_date);
  const countdown = daysUntil(wedding.wedding_date);
  const cover = wedding.cover_image_url || "/background/hero-luxe.jpg";

  return (
    <div className="min-h-screen bg-luxe-black text-luxe-cream">
      {/* HERO */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden text-center">
        <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxe-black/70 via-luxe-black/60 to-luxe-black" />

        <div className="relative px-6 py-24">
          <p className="font-serif-luxe text-xs uppercase tracking-[0.5em] text-luxe-gold">
            Nosso casamento
          </p>
          <h1 className="mt-6 font-script text-7xl leading-none text-luxe-gold sm:text-8xl">
            {wedding.couple_names}
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-luxe-cream/85">
            {dateLabel && (
              <span className="inline-flex items-center gap-2 font-serif-luxe tracking-wide">
                <CalendarDays size={17} strokeWidth={1.5} /> {dateLabel}
              </span>
            )}
            {(wedding.city || wedding.venue) && (
              <span className="inline-flex items-center gap-2 font-serif-luxe tracking-wide">
                <MapPin size={17} strokeWidth={1.5} /> {wedding.venue || wedding.city}
              </span>
            )}
          </div>
          {countdown !== null && countdown >= 0 && (
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-luxe-gold/30 bg-luxe-gold/5 px-6 py-2.5 backdrop-blur-sm">
              <Heart size={15} className="fill-luxe-gold text-luxe-gold" />
              <span className="font-serif-luxe tracking-[0.15em] text-luxe-cream">
                {countdown === 0 ? "É hoje!" : `Faltam ${countdown} dias para o grande dia`}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* MENSAGEM */}
      {wedding.welcome_message && (
        <section className="mx-auto max-w-2xl px-6 py-20 text-center">
          <LuxeOrnament className="mx-auto w-20" />
          <p className="mt-6 font-serif-luxe text-2xl font-light leading-relaxed text-luxe-cream/90 sm:text-3xl">
            {wedding.welcome_message}
          </p>
        </section>
      )}

      {/* LISTA DE PRESENTES */}
      <section id="presentes" className="border-t border-luxe-gold/10 bg-luxe-panel py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="font-serif-luxe text-xs uppercase tracking-[0.4em] text-luxe-gold">
              Com carinho
            </p>
            <h2 className="mt-4 font-serif-luxe text-4xl font-light text-luxe-cream">
              Lista de presentes
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-luxe-muted">
              Sua presença é o nosso maior presente. Mas se quiser nos
              presentear, ficaremos muito felizes.
            </p>
          </div>

          {gifts.length === 0 ? (
            <div className="mt-12 rounded-[18px] border border-dashed border-luxe-gold/20 bg-luxe-card/50 p-10 text-center text-luxe-muted">
              A lista de presentes ainda está sendo preparada. Volte em breve.
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gifts.map((g) => {
                const Icon = giftIcon(g.category);
                return (
                  <div
                    key={g.id}
                    className="group flex flex-col overflow-hidden rounded-[18px] border border-luxe-gold/12 bg-luxe-card transition-all duration-300 hover:-translate-y-1 hover:border-luxe-gold/25 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]"
                  >
                    <div className="relative h-44 overflow-hidden bg-[#0f0f0f]">
                      {g.image_url ? (
                        <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-luxe-gold/70">
                          <Icon size={40} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif-luxe text-lg text-luxe-cream">{g.title}</h3>
                      {g.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-luxe-muted">{g.description}</p>
                      )}
                      <p className="mt-3 font-serif-luxe text-2xl font-light text-luxe-gold">
                        {BRL.format(Number(g.price))}
                        {g.type === "quota" && (
                          <span className="ml-1 text-sm text-luxe-muted">/ cota</span>
                        )}
                      </p>
                      <Link
                        href="#"
                        className={cn(
                          "mt-5 inline-flex items-center justify-center rounded-full border border-luxe-gold/60 px-4 py-2.5",
                          "text-[11px] uppercase tracking-[0.2em] text-luxe-gold transition-colors duration-300",
                          "hover:bg-luxe-gold hover:text-luxe-black"
                        )}
                      >
                        Presentear
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-luxe-gold/10 py-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-luxe-muted transition-colors hover:text-luxe-gold"
        >
          <img src="/luxe/logo-casaja.png" alt="" className="h-6 w-auto opacity-80" />
          Feito com Case-já
        </Link>
      </footer>
    </div>
  );
}
