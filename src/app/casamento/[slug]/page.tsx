import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Gift, Plane, Heart, PiggyBank } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LuxeOrnament } from "@/components/luxe/ui";
import { RsvpForm } from "./rsvp-form";
import { WeddingGallery } from "./wedding-gallery";
import { getTheme } from "@/lib/themes";
import { getPlan } from "@/lib/plans";
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
  const [{ data: giftsData }, { data: photosData }] = await Promise.all([
    supabase
      .from("gifts")
      .select("*")
      .eq("wedding_id", wedding.id)
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("photos")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);
  const gifts = (giftsData ?? []) as GiftRow[];
  const photos = photosData ?? [];

  // Premium remove a marca "Feito com Case-já" do rodapé.
  const removeBranding = getPlan(wedding).limits.removeBranding;

  const dateLabel = formatDate(wedding.wedding_date);
  const countdown = daysUntil(wedding.wedding_date);
  const theme = getTheme(wedding.theme);
  const cover = wedding.cover_image_url;

  const light = theme.light;

  return (
    <div
      className={cn(
        "min-h-screen",
        light ? "bg-[#faf7f2] text-[#2b2620]" : "bg-luxe-black text-luxe-cream"
      )}
    >
      {/* HERO (sempre escuro, para legibilidade sobre a foto) */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden text-center">
        {cover ? (
          <>
            <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b from-luxe-black/70 via-luxe-black/60",
                light ? "to-[#1a1611]" : "to-luxe-black"
              )}
            />
          </>
        ) : (
          <div className={cn("absolute inset-0", theme.heroDark)} />
        )}

        <div className="relative px-6 py-24">
          <p className={cn("font-serif-luxe text-xs uppercase tracking-[0.5em]", theme.heroText)}>
            Nosso casamento
          </p>
          <h1 className={cn("mt-6 font-script text-7xl leading-none sm:text-8xl", theme.heroText)}>
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
            <div
              className={cn(
                "mt-10 inline-flex items-center gap-2 rounded-full border px-6 py-2.5 backdrop-blur-sm",
                theme.chipDark
              )}
            >
              <Heart size={15} className="fill-current" />
              <span className="font-serif-luxe tracking-[0.15em]">
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
          <p
            className={cn(
              "mt-6 font-serif-luxe text-2xl font-light leading-relaxed sm:text-3xl",
              light ? "text-[#3d362d]" : "text-luxe-cream/90"
            )}
          >
            {wedding.welcome_message}
          </p>
        </section>
      )}

      {/* GALERIA */}
      {photos.length > 0 && (
        <section
          id="galeria"
          className={cn("border-t py-20", light ? "border-black/10" : "border-luxe-gold/10")}
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <p className={cn("font-serif-luxe text-xs uppercase tracking-[0.4em]", theme.textDark)}>
                Galeria
              </p>
              <h2
                className={cn(
                  "mt-4 font-serif-luxe text-4xl font-light",
                  light ? "text-[#2b2620]" : "text-luxe-cream"
                )}
              >
                Nossos momentos
              </h2>
            </div>
            <WeddingGallery photos={photos} light={light} />
          </div>
        </section>
      )}

      {/* RSVP */}
      <section
        id="rsvp"
        className={cn("border-t py-20", light ? "border-black/10" : "border-luxe-gold/10")}
      >
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className={cn("font-serif-luxe text-xs uppercase tracking-[0.4em]", theme.textDark)}>
            Sua presença
          </p>
          <h2
            className={cn(
              "mt-4 font-serif-luxe text-4xl font-light",
              light ? "text-[#2b2620]" : "text-luxe-cream"
            )}
          >
            Confirme sua presença
          </h2>
          <p className={cn("mx-auto mt-3 max-w-md", light ? "text-[#6b6257]" : "text-luxe-muted")}>
            Ficaremos muito felizes em celebrar esse dia com você. Conte para nós
            se poderá comparecer.
          </p>
        </div>
        <div className="mt-10 px-6">
          <RsvpForm weddingId={wedding.id} light={light} />
        </div>
      </section>

      {/* LISTA DE PRESENTES */}
      <section
        id="presentes"
        className={cn(
          "border-t py-20",
          light ? "border-black/10 bg-[#f3eee5]" : "border-luxe-gold/10 bg-luxe-panel"
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className={cn("font-serif-luxe text-xs uppercase tracking-[0.4em]", theme.textDark)}>
              Com carinho
            </p>
            <h2
              className={cn(
                "mt-4 font-serif-luxe text-4xl font-light",
                light ? "text-[#2b2620]" : "text-luxe-cream"
              )}
            >
              Lista de presentes
            </h2>
            <p className={cn("mx-auto mt-3 max-w-lg", light ? "text-[#6b6257]" : "text-luxe-muted")}>
              Sua presença é o nosso maior presente. Mas se quiser nos
              presentear, ficaremos muito felizes.
            </p>
          </div>

          {gifts.length === 0 ? (
            <div
              className={cn(
                "mt-12 rounded-[18px] border border-dashed p-10 text-center",
                light
                  ? "border-black/15 bg-white/60 text-[#6b6257]"
                  : "border-luxe-gold/20 bg-luxe-card/50 text-luxe-muted"
              )}
            >
              A lista de presentes ainda está sendo preparada. Volte em breve.
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gifts.map((g) => {
                const Icon = giftIcon(g.category);
                return (
                  <div
                    key={g.id}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-[18px] border transition-all duration-300 hover:-translate-y-1",
                      light
                        ? "border-black/10 bg-white shadow-sm hover:shadow-md"
                        : "border-luxe-gold/12 bg-luxe-card hover:border-luxe-gold/25 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]"
                    )}
                  >
                    <div className={cn("relative h-44 overflow-hidden", light ? "bg-[#efe9de]" : "bg-[#0f0f0f]")}>
                      {g.image_url ? (
                        <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className={cn("flex h-full w-full items-center justify-center opacity-80", theme.textDark)}>
                          <Icon size={40} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className={cn("font-serif-luxe text-lg", light ? "text-[#2b2620]" : "text-luxe-cream")}>{g.title}</h3>
                      {g.description && (
                        <p className={cn("mt-1 line-clamp-2 text-sm", light ? "text-[#6b6257]" : "text-luxe-muted")}>{g.description}</p>
                      )}
                      <p className={cn("mt-3 font-serif-luxe text-2xl font-light", theme.textDark)}>
                        {BRL.format(Number(g.price))}
                        {g.type === "quota" && (
                          <span className={cn("ml-1 text-sm", light ? "text-[#6b6257]" : "text-luxe-muted")}>/ cota</span>
                        )}
                      </p>
                      <Link
                        href={`/casamento/${slug}/presentear/${g.id}`}
                        className={cn(
                          "mt-5 inline-flex items-center justify-center rounded-full border px-4 py-2.5",
                          "text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
                          theme.btnDark
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

      {/* RODAPÉ — a marca "Feito com Case-já" é ocultada no plano Premium. */}
      {!removeBranding && (
        <footer
          className={cn("border-t py-10 text-center", light ? "border-black/10" : "border-luxe-gold/10")}
        >
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] transition-colors",
              light ? "text-[#6b6257] hover:text-[#9a7325]" : "text-luxe-muted hover:text-luxe-gold"
            )}
          >
            <img src="/luxe/logo-casaja.png" alt="" className="h-6 w-auto opacity-80" />
            Feito com Case-já
          </Link>
        </footer>
      )}
    </div>
  );
}
