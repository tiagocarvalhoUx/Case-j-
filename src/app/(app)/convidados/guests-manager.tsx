"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Loader2,
  Plus,
  Trash2,
  Search,
  MessageCircle,
  Check,
  X,
  Clock,
  Users,
} from "lucide-react";
import { addGuest, setGuestRsvp, deleteGuest, type GuestState } from "./actions";
import type { Guest, RsvpStatus } from "@/lib/supabase/types";
import {
  LuxeCard,
  LuxeButton,
  LuxeInput,
  LuxeLabel,
  LuxeBadge,
} from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

const RSVP_LABEL: Record<RsvpStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  declined: "Recusou",
};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
      Adicionar convidado
    </LuxeButton>
  );
}

function whatsappLink(guest: Guest, coupleNames: string, siteUrl: string) {
  const text = encodeURIComponent(
    `Olá, ${guest.name}! 💍\n\nTemos a alegria de convidar você para o nosso casamento!\n\nConfirme sua presença e veja todos os detalhes no nosso site:\n${siteUrl}\n\nCom carinho,\n${coupleNames}`
  );
  const digits = (guest.phone || "").replace(/\D/g, "");
  const phone = digits.length >= 10 ? (digits.startsWith("55") ? digits : `55${digits}`) : "";
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function GuestsManager({
  guests,
  slug,
  coupleNames,
}: {
  guests: Guest[];
  slug: string;
  coupleNames: string;
}) {
  const [state, formAction] = useActionState<GuestState, FormData>(addGuest, {});
  const [filter, setFilter] = useState<"all" | RsvpStatus>("all");
  const [query, setQuery] = useState("");
  const [siteUrl, setSiteUrl] = useState(`https://case-ja.vercel.app/casamento/${slug}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(`${window.location.origin}/casamento/${slug}`);
    }
  }, [slug]);

  const totals = useMemo(() => {
    const confirmed = guests.filter((g) => g.rsvp === "confirmed");
    return {
      guests: guests.length,
      people: guests.reduce((s, g) => s + g.party_size, 0),
      confirmedPeople: confirmed.reduce((s, g) => s + g.party_size, 0),
      pending: guests.filter((g) => g.rsvp === "pending").length,
    };
  }, [guests]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((g) => {
      if (filter !== "all" && g.rsvp !== filter) return false;
      if (q && !`${g.name} ${g.party_group ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [guests, filter, query]);

  const stats = [
    { label: "Convidados", value: totals.guests },
    { label: "Pessoas (c/ acomp.)", value: totals.people },
    { label: "Pessoas confirmadas", value: totals.confirmedPeople },
    { label: "Pendentes", value: totals.pending },
  ];

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <LuxeCard key={s.label} className="p-5">
            <p className="font-serif-luxe text-3xl font-light text-luxe-gold">{s.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-luxe-muted">{s.label}</p>
          </LuxeCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Adicionar */}
        <form action={formAction}>
          <LuxeCard className="space-y-5">
            <h2 className="font-serif-luxe text-xl text-luxe-cream">Novo convidado</h2>
            {state.success && (
              <div className="rounded-xl border border-luxe-gold/25 bg-luxe-gold/10 px-4 py-3 text-sm text-luxe-gold">
                Convidado adicionado!
              </div>
            )}
            {state.error && (
              <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {state.error}
              </div>
            )}
            <div>
              <LuxeLabel htmlFor="g-name">Nome</LuxeLabel>
              <LuxeInput id="g-name" name="name" placeholder="Nome e sobrenome" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <LuxeLabel htmlFor="g-phone">WhatsApp</LuxeLabel>
                <LuxeInput id="g-phone" name="phone" inputMode="tel" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <LuxeLabel htmlFor="g-size">Nº de pessoas</LuxeLabel>
                <LuxeInput id="g-size" name="party_size" type="number" min={1} defaultValue={1} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <LuxeLabel htmlFor="g-group">Grupo</LuxeLabel>
                <LuxeInput id="g-group" name="party_group" placeholder="Família da noiva" />
              </div>
              <div>
                <LuxeLabel htmlFor="g-email">E-mail</LuxeLabel>
                <LuxeInput id="g-email" name="email" type="email" placeholder="opcional" />
              </div>
            </div>
            <AddButton />
            <p className="text-[11px] text-luxe-muted/70">
              Dica: use o botão do WhatsApp na lista para enviar o convite com o
              link do site — o convidado confirma sozinho.
            </p>
          </LuxeCard>
        </form>

        {/* Lista */}
        <div>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {(
                [
                  ["all", "Todos"],
                  ["confirmed", "Confirmados"],
                  ["pending", "Pendentes"],
                  ["declined", "Recusaram"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors",
                    filter === key
                      ? "border-luxe-gold text-luxe-gold"
                      : "border-white/10 text-luxe-muted hover:border-white/25"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxe-muted/60" />
              <LuxeInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar convidado..."
                className="h-10 pl-9 sm:w-56"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <LuxeCard className="py-12 text-center text-luxe-muted">
              <Users size={28} strokeWidth={1.25} className="mx-auto text-luxe-muted/50" />
              <p className="mt-3">
                {guests.length === 0
                  ? "Nenhum convidado ainda. Adicione o primeiro ao lado."
                  : "Nenhum convidado neste filtro."}
              </p>
            </LuxeCard>
          ) : (
            <div className="space-y-3">
              {visible.map((g) => (
                <LuxeCard key={g.id} className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-luxe-cream">{g.name}</p>
                        <LuxeBadge
                          variant={
                            g.rsvp === "confirmed" ? "gold" : g.rsvp === "declined" ? "muted" : "emerald"
                          }
                        >
                          {RSVP_LABEL[g.rsvp]}
                        </LuxeBadge>
                        {g.party_size > 1 && (
                          <span className="text-[11px] text-luxe-muted">
                            {g.party_size} pessoas
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-luxe-muted/80">
                        {[g.party_group, g.phone].filter(Boolean).join(" · ") || "—"}
                      </p>
                      {g.notes && (
                        <p className="mt-1 text-xs italic text-luxe-muted/70">“{g.notes}”</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Status rápido */}
                      {(
                        [
                          ["confirmed", Check, "Confirmar"],
                          ["pending", Clock, "Pendente"],
                          ["declined", X, "Recusou"],
                        ] as const
                      ).map(([status, Icon, title]) => (
                        <form key={status} action={setGuestRsvp}>
                          <input type="hidden" name="id" value={g.id} />
                          <input type="hidden" name="rsvp" value={status} />
                          <button
                            type="submit"
                            title={title}
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              g.rsvp === status
                                ? "text-luxe-gold"
                                : "text-luxe-muted/50 hover:bg-white/5 hover:text-luxe-cream"
                            )}
                          >
                            <Icon size={15} strokeWidth={1.75} />
                          </button>
                        </form>
                      ))}

                      <a
                        href={whatsappLink(g, coupleNames, siteUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Enviar convite pelo WhatsApp"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-luxe-muted hover:bg-white/5 hover:text-luxe-gold"
                      >
                        <MessageCircle size={15} strokeWidth={1.75} />
                      </a>

                      <form action={deleteGuest}>
                        <input type="hidden" name="id" value={g.id} />
                        <button
                          type="submit"
                          title="Excluir"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-luxe-muted hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={15} strokeWidth={1.75} />
                        </button>
                      </form>
                    </div>
                  </div>
                </LuxeCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
