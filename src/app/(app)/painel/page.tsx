import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Globe,
  Gift,
  Users,
  CalendarCheck,
  Store,
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { LuxeCard, LuxeBadge, LuxeEyebrow } from "@/components/luxe/ui";

export const metadata: Metadata = {
  title: "Painel",
};

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

export default async function PainelPage() {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();

  const [guestsRes, confirmedRes, giftsRes, paidRes] = await Promise.all([
    supabase.from("guests").select("*", { count: "exact", head: true }).eq("wedding_id", wedding.id),
    supabase.from("guests").select("*", { count: "exact", head: true }).eq("wedding_id", wedding.id).eq("rsvp", "confirmed"),
    supabase.from("gifts").select("*", { count: "exact", head: true }).eq("wedding_id", wedding.id),
    supabase.from("contributions").select("amount").eq("wedding_id", wedding.id).eq("status", "paid"),
  ]);

  const guestsCount = guestsRes.count ?? 0;
  const confirmedCount = confirmedRes.count ?? 0;
  const giftsCount = giftsRes.count ?? 0;
  const raised = (paidRes.data ?? []).reduce((sum, c) => sum + Number(c.amount), 0);

  const milestones = [true, giftsCount > 0, guestsCount > 0, wedding.published];
  const progress = Math.round((milestones.filter(Boolean).length / milestones.length) * 100);

  const dateLabel = formatDate(wedding.wedding_date);
  const countdown = daysUntil(wedding.wedding_date);

  const stats = [
    { label: "Convidados", value: String(guestsCount) },
    { label: "Confirmados", value: String(confirmedCount) },
    { label: "Presentes", value: String(giftsCount) },
    { label: "Arrecadado", value: BRL.format(raised) },
  ];

  const modules = [
    { icon: Globe, title: "Site do casamento", desc: "Personalize tema, história e informações.", status: wedding.published ? "Publicado" : "Rascunho", href: "/site" },
    { icon: Gift, title: "Lista de presentes", desc: "Presentes em dinheiro e cotas de lua de mel.", status: giftsCount > 0 ? `${giftsCount} itens` : "Adicionar", href: "/presentes" },
    { icon: Users, title: "Convidados & RSVP", desc: "Importe convidados e acompanhe confirmações.", status: guestsCount > 0 ? `${guestsCount} convidados` : "Em breve", href: "#" },
    { icon: CalendarCheck, title: "Cronograma", desc: "Checklist de tarefas para não esquecer nada.", status: "Em breve", href: "#" },
    { icon: Store, title: "Fornecedores", desc: "Organize contatos, contratos e pagamentos.", status: "Em breve", href: "#" },
  ];

  return (
    <Container className="py-12">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3">
        <LuxeEyebrow>Painel do casal</LuxeEyebrow>
        <h1 className="font-serif-luxe text-4xl font-light text-luxe-cream">
          {wedding.couple_names}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-luxe-muted">
          {dateLabel && (
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} strokeWidth={1.5} /> {dateLabel}
              {countdown !== null && countdown >= 0 && (
                <span className="ml-1 text-luxe-gold">· faltam {countdown} dias</span>
              )}
            </span>
          )}
          {wedding.city && (
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} strokeWidth={1.5} /> {wedding.city}
            </span>
          )}
          <span className="inline-flex items-center gap-2 text-luxe-muted/70">
            case-ja.com.br/{wedding.slug}
          </span>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <LuxeCard key={s.label} className="p-6">
            <p className="font-serif-luxe text-3xl font-light text-luxe-gold">{s.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-luxe-muted">{s.label}</p>
          </LuxeCard>
        ))}
      </div>

      {/* Progresso */}
      <LuxeCard className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif-luxe text-lg text-luxe-cream">Progresso do planejamento</p>
          <p className="text-sm text-luxe-muted">
            {progress < 100
              ? "Complete os passos para publicar o site do casamento."
              : "Tudo pronto! Seu casamento está no ar."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-luxe-gold to-luxe-gold-soft transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-luxe-gold">{progress}%</span>
        </div>
      </LuxeCard>

      {/* Módulos */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const emBreve = m.status === "Em breve";
          return (
            <Link key={m.title} href={m.href} className="group">
              <LuxeCard hover className="h-full">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-luxe-gold/25 text-luxe-gold transition-colors group-hover:bg-luxe-gold group-hover:text-luxe-black">
                    <m.icon size={20} strokeWidth={1.5} />
                  </span>
                  <LuxeBadge variant={emBreve ? "muted" : "gold"}>{m.status}</LuxeBadge>
                </div>
                <h2 className="mt-5 font-serif-luxe text-xl text-luxe-cream">{m.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-luxe-muted">{m.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-luxe-gold">
                  Abrir <ArrowRight size={14} strokeWidth={1.5} />
                </span>
              </LuxeCard>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
