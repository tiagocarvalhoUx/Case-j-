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
  Sparkles,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("pt-BR", {
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
  const diff = Math.round((target - today.getTime()) / 86_400_000);
  return diff;
}

export default async function PainelPage() {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();

  const [guestsRes, confirmedRes, giftsRes, paidRes] = await Promise.all([
    supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("wedding_id", wedding.id),
    supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("wedding_id", wedding.id)
      .eq("rsvp", "confirmed"),
    supabase
      .from("gifts")
      .select("*", { count: "exact", head: true })
      .eq("wedding_id", wedding.id),
    supabase
      .from("contributions")
      .select("amount")
      .eq("wedding_id", wedding.id)
      .eq("status", "paid"),
  ]);

  const guestsCount = guestsRes.count ?? 0;
  const confirmedCount = confirmedRes.count ?? 0;
  const giftsCount = giftsRes.count ?? 0;
  const raised = (paidRes.data ?? []).reduce((sum, c) => sum + Number(c.amount), 0);

  // Progresso: 4 marcos.
  const milestones = [
    true, // informações básicas (casamento criado)
    giftsCount > 0,
    guestsCount > 0,
    wedding.published,
  ];
  const progress = Math.round(
    (milestones.filter(Boolean).length / milestones.length) * 100
  );

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
    <Container className="py-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2">
        <Badge variant="gold" className="w-fit">
          <Sparkles size={14} /> Painel do casal
        </Badge>
        <h1 className="text-3xl font-semibold text-navy-900">
          {wedding.couple_names}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-500">
          {dateLabel && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} /> {dateLabel}
              {countdown !== null && countdown >= 0 && (
                <span className="ml-1 font-semibold text-primary-600">
                  · faltam {countdown} dias
                </span>
              )}
            </span>
          )}
          {wedding.city && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} /> {wedding.city}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-ink-400">
            case-ja.com.br/{wedding.slug}
          </span>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="font-display text-2xl font-semibold text-navy-900">
              {s.value}
            </p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Progresso */}
      <Card className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-900">
            Progresso do planejamento
          </p>
          <p className="text-sm text-ink-500">
            {progress < 100
              ? "Complete os passos para publicar o site do casamento."
              : "Tudo pronto! Seu casamento está no ar. 🎉"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-primary-600">
            {progress}%
          </span>
        </div>
      </Card>

      {/* Módulos */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const emBreve = m.status === "Em breve";
          return (
            <Link key={m.title} href={m.href} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <m.icon size={22} />
                  </span>
                  <Badge variant={emBreve ? "neutral" : "brand"}>
                    {m.status}
                  </Badge>
                </div>
                <h2 className="mt-5 text-lg font-semibold text-navy-900">
                  {m.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">
                  {m.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Abrir <ArrowRight size={15} />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
