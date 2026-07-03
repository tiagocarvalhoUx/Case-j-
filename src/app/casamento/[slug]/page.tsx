import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Gift, Plane, Heart, PiggyBank } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTheme } from "@/lib/themes";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import type { Gift as GiftRow, Wedding } from "@/lib/supabase/types";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

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
  const { data } = await supabase
    .from("weddings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
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

  const theme = getTheme(wedding.theme);
  const dateLabel = formatDate(wedding.wedding_date);
  const countdown = daysUntil(wedding.wedding_date);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-center">
        {wedding.cover_image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wedding.cover_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-navy-950/55" />
          </>
        ) : (
          <div className={cn("absolute inset-0", theme.hero)} />
        )}

        <div className="relative px-6 py-20 text-white">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-white/80">
            Nosso casamento
          </p>
          <h1 className="mt-3 font-script text-6xl leading-tight tracking-normal sm:text-7xl">
            {wedding.couple_names}
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/90">
            {dateLabel && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={18} /> {dateLabel}
              </span>
            )}
            {(wedding.city || wedding.venue) && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={18} /> {wedding.venue || wedding.city}
              </span>
            )}
          </div>
          {countdown !== null && countdown >= 0 && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 backdrop-blur-sm">
              <Heart size={16} fill="currentColor" />
              <span className="font-semibold">
                {countdown === 0
                  ? "É hoje! 🎉"
                  : `Faltam ${countdown} dias para o grande dia`}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* MENSAGEM */}
      {wedding.welcome_message && (
        <section className="mx-auto max-w-2xl px-6 py-16 text-center">
          <span className={cn("inline-block", theme.accentText)}>
            <Heart size={22} fill="currentColor" />
          </span>
          <p className="mt-4 font-display text-xl leading-relaxed text-navy-800 sm:text-2xl">
            {wedding.welcome_message}
          </p>
        </section>
      )}

      {/* LISTA DE PRESENTES */}
      <section id="presentes" className="bg-surface-muted py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-navy-900">
              Lista de presentes
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-ink-500">
              Sua presença é o nosso maior presente. Mas se quiser nos
              presentear, ficaremos muito felizes 💝
            </p>
          </div>

          {gifts.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-ink-500">
              A lista de presentes ainda está sendo preparada. Volte em breve!
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gifts.map((g) => {
                const Icon = giftIcon(g.category);
                return (
                  <div
                    key={g.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-sm"
                  >
                    <div className="relative h-40 bg-ink-100">
                      {g.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.image_url}
                          alt={g.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-full w-full items-center justify-center text-white",
                            theme.hero
                          )}
                        >
                          <Icon size={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-navy-900">{g.title}</h3>
                      {g.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-ink-500">
                          {g.description}
                        </p>
                      )}
                      <p className="mt-3 font-display text-xl font-semibold text-navy-900">
                        {BRL.format(Number(g.price))}
                        {g.type === "quota" && (
                          <span className="ml-1 text-sm font-normal text-ink-400">
                            / cota
                          </span>
                        )}
                      </p>
                      <Link
                        href={`#`}
                        className={cn(
                          "mt-4 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90",
                          theme.accentBg
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
      <footer className="border-t border-ink-200/70 py-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-navy-900"
        >
          <LogoMark className="h-5 w-5" /> Feito com Case-já
        </Link>
      </footer>
    </div>
  );
}
