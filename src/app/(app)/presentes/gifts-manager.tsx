"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Trash2, Eye, EyeOff, Plane, Gift, PiggyBank } from "lucide-react";
import {
  createGift,
  deleteGift,
  toggleGiftActive,
  type GiftState,
} from "./actions";
import type { Gift as GiftRow } from "@/lib/supabase/types";
import {
  LuxeCard,
  LuxeButton,
  LuxeInput,
  LuxeTextarea,
  LuxeLabel,
  LuxeBadge,
} from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const suggestions = [
  { title: "Cota de lua de mel", price: "150", type: "quota", category: "Lua de mel" },
  { title: "Jantar romântico", price: "300", type: "fixed", category: "Experiências" },
  { title: "Passagem aérea", price: "1200", type: "quota", category: "Lua de mel" },
  { title: "Diária de hotel", price: "600", type: "quota", category: "Lua de mel" },
];

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
      Adicionar presente
    </LuxeButton>
  );
}

export function GiftsManager({ gifts }: { gifts: GiftRow[] }) {
  const [state, formAction] = useActionState<GiftState, FormData>(createGift, {});
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"fixed" | "quota">("fixed");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (state.success) {
      setTitle("");
      setPrice("");
      setCategory("");
      setType("fixed");
    }
  }, [state.success]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Formulário */}
      <form action={formAction}>
        <LuxeCard className="space-y-5">
          <h2 className="font-serif-luxe text-xl text-luxe-cream">Novo presente</h2>

          {state.success && (
            <div className="rounded-xl border border-luxe-gold/25 bg-luxe-gold/10 px-4 py-3 text-sm text-luxe-gold">
              Presente adicionado!
            </div>
          )}
          {state.error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {state.error}
            </div>
          )}

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-luxe-muted">Sugestões rápidas</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => {
                    setTitle(s.title);
                    setPrice(s.price);
                    setType(s.type as "fixed" | "quota");
                    setCategory(s.category);
                  }}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-luxe-muted transition-colors hover:border-luxe-gold/50 hover:text-luxe-gold"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <LuxeLabel htmlFor="title">Nome do presente</LuxeLabel>
            <LuxeInput id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cota de lua de mel" required />
          </div>

          <div>
            <LuxeLabel>Tipo</LuxeLabel>
            <input type="hidden" name="type" value={type} />
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "fixed", label: "Valor fixo", desc: "Presente único" },
                { key: "quota", label: "Cota", desc: "Várias contribuições" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setType(t.key as "fixed" | "quota")}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    type === t.key ? "border-luxe-gold bg-luxe-gold/5" : "border-white/10 hover:border-white/25"
                  )}
                >
                  <span className="block text-sm text-luxe-cream">{t.label}</span>
                  <span className="block text-[11px] text-luxe-muted">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <LuxeLabel htmlFor="price">Valor {type === "quota" ? "por cota" : ""} (R$)</LuxeLabel>
              <LuxeInput id="price" name="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="150,00" required />
            </div>
            <div>
              <LuxeLabel htmlFor="category">Categoria</LuxeLabel>
              <LuxeInput id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Lua de mel" />
            </div>
          </div>

          <div>
            <LuxeLabel htmlFor="description">Descrição (opcional)</LuxeLabel>
            <LuxeTextarea id="description" name="description" placeholder="Ajude o casal a realizar esse sonho..." className="min-h-20" />
          </div>

          <div>
            <LuxeLabel htmlFor="image_url">Foto (URL, opcional)</LuxeLabel>
            <LuxeInput id="image_url" name="image_url" type="url" placeholder="https://..." />
          </div>

          <AddButton />
        </LuxeCard>
      </form>

      {/* Lista */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif-luxe text-xl text-luxe-cream">Sua lista ({gifts.length})</h2>
        </div>

        {gifts.length === 0 ? (
          <LuxeCard className="py-12 text-center text-luxe-muted">
            <Gift size={28} strokeWidth={1.25} className="mx-auto text-luxe-muted/50" />
            <p className="mt-3">Nenhum presente ainda.</p>
            <p className="text-sm">Adicione o primeiro usando o formulário ao lado.</p>
          </LuxeCard>
        ) : (
          <div className="space-y-3">
            {gifts.map((g) => {
              const Icon = g.category?.toLowerCase().includes("lua")
                ? Plane
                : g.type === "quota"
                  ? PiggyBank
                  : Gift;
              return (
                <LuxeCard key={g.id} className={cn("flex items-center gap-4 p-4", !g.active && "opacity-50")}>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-luxe-gold/25 text-luxe-gold">
                    <Icon size={19} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-luxe-cream">{g.title}</p>
                      {g.type === "quota" && <LuxeBadge variant="gold">Cota</LuxeBadge>}
                      {!g.active && <LuxeBadge variant="muted">Oculto</LuxeBadge>}
                    </div>
                    <p className="text-sm text-luxe-muted">
                      {BRL.format(Number(g.price))}
                      {g.category ? ` · ${g.category}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <form action={toggleGiftActive}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="active" value={(!g.active).toString()} />
                      <button type="submit" title={g.active ? "Ocultar do site" : "Mostrar no site"} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-luxe-muted hover:bg-white/5 hover:text-luxe-gold">
                        {g.active ? <Eye size={17} strokeWidth={1.5} /> : <EyeOff size={17} strokeWidth={1.5} />}
                      </button>
                    </form>
                    <form action={deleteGift}>
                      <input type="hidden" name="id" value={g.id} />
                      <button type="submit" title="Excluir" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-luxe-muted hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 size={17} strokeWidth={1.5} />
                      </button>
                    </form>
                  </div>
                </LuxeCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
