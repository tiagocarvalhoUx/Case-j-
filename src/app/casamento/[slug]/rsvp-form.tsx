"use client";

import { useState } from "react";
import { Loader2, Check, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  LuxeButton,
  LuxeInput,
  LuxeTextarea,
  LuxeLabel,
} from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

export function RsvpForm({
  weddingId,
  light = false,
}: {
  weddingId: string;
  light?: boolean;
}) {
  const [attending, setAttending] = useState<"confirmed" | "declined">("confirmed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Overrides p/ tema claro (tailwind-merge resolve os conflitos)
  const cardCls = light
    ? "border-black/10 bg-white shadow-sm"
    : "border-luxe-gold/15 bg-luxe-card/70";
  const labelCls = light ? "text-[#6b6257]" : "";
  const inputCls = light
    ? "border-black/15 bg-[#faf7f2] text-[#2b2620] placeholder:text-black/35 focus:border-[#9a7325] focus:ring-[rgba(154,115,37,0.15)]"
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    const partySize = Math.max(1, Number(form.get("party_size") || 1));

    if (name.length < 2) {
      setError("Por favor, informe seu nome.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("guests").insert({
      wedding_id: weddingId,
      name,
      email: email || null,
      rsvp: attending,
      party_size: attending === "confirmed" ? partySize : 1,
      notes: message || null,
    });

    if (error) {
      setError("Não foi possível enviar. Tente novamente.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className={cn("mx-auto max-w-md rounded-[18px] border p-10 text-center", cardCls)}>
        <span
          className={cn(
            "mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border",
            light ? "border-[#9a7325]/40 text-[#9a7325]" : "border-luxe-gold/30 text-luxe-gold"
          )}
        >
          <Heart size={22} className="fill-current" />
        </span>
        <h3 className={cn("mt-5 font-serif-luxe text-2xl", light ? "text-[#2b2620]" : "text-luxe-cream")}>
          {attending === "confirmed" ? "Presença confirmada!" : "Recebemos seu recado"}
        </h3>
        <p className={cn("mt-2", light ? "text-[#6b6257]" : "text-luxe-muted")}>
          {attending === "confirmed"
            ? "Que alegria! Mal podemos esperar para celebrar com você."
            : "Sentiremos sua falta, mas obrigado por avisar."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("mx-auto max-w-lg rounded-[18px] border p-6 sm:p-8", cardCls)}
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Vai comparecer? */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "confirmed", label: "Sim, vou!" },
          { key: "declined", label: "Não poderei" },
        ].map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setAttending(o.key as "confirmed" | "declined")}
            className={cn(
              "rounded-xl border py-3 font-serif-luxe tracking-wide transition-colors",
              attending === o.key
                ? light
                  ? "border-[#9a7325] bg-[#9a7325]/10 text-[#9a7325]"
                  : "border-luxe-gold bg-luxe-gold/10 text-luxe-gold"
                : light
                  ? "border-black/15 text-[#6b6257] hover:border-black/30"
                  : "border-white/10 text-luxe-muted hover:border-white/25"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <LuxeLabel htmlFor="rsvp-name" className={labelCls}>Seu nome</LuxeLabel>
          <LuxeInput id="rsvp-name" name="name" placeholder="Nome e sobrenome" required className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <LuxeLabel htmlFor="rsvp-email" className={labelCls}>E-mail (opcional)</LuxeLabel>
            <LuxeInput id="rsvp-email" name="email" type="email" placeholder="voce@email.com" className={inputCls} />
          </div>
          {attending === "confirmed" && (
            <div>
              <LuxeLabel htmlFor="rsvp-size" className={labelCls}>Nº de pessoas</LuxeLabel>
              <LuxeInput id="rsvp-size" name="party_size" type="number" min={1} defaultValue={1} className={inputCls} />
            </div>
          )}
        </div>

        <div>
          <LuxeLabel htmlFor="rsvp-msg" className={labelCls}>Deixe um recado (opcional)</LuxeLabel>
          <LuxeTextarea id="rsvp-msg" name="message" placeholder="Uma mensagem carinhosa para o casal..." className={cn("min-h-20", inputCls)} />
        </div>

        <LuxeButton type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 size={18} className="animate-spin" />}
          {attending === "confirmed" ? (
            <>
              <Check size={16} strokeWidth={2} /> Confirmar presença
            </>
          ) : (
            "Enviar resposta"
          )}
        </LuxeButton>
      </div>
    </form>
  );
}
