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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const suggestions = [
  { title: "Cota de lua de mel", price: "150", type: "quota", category: "Lua de mel" },
  { title: "Jantar romântico", price: "300", type: "fixed", category: "Experiências" },
  { title: "Passagem aérea", price: "1200", type: "quota", category: "Lua de mel" },
  { title: "Diária de hotel", price: "600", type: "quota", category: "Lua de mel" },
];

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
      Adicionar presente
    </Button>
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
      {/* Formulário de adição */}
      <form action={formAction}>
        <Card className="space-y-5">
          <h2 className="text-lg font-semibold text-navy-900">Novo presente</h2>

          {state.success && (
            <div className="rounded-xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-600">
              Presente adicionado! 🎁
            </div>
          )}
          {state.error && (
            <div className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-3 text-sm text-danger-600">
              {state.error}
            </div>
          )}

          {/* Sugestões */}
          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">Sugestões rápidas</p>
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
                  className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Nome do presente</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cota de lua de mel"
              required
            />
          </div>

          <div>
            <Label>Tipo</Label>
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
                    "rounded-xl border-2 p-3 text-left transition-colors",
                    type === t.key
                      ? "border-primary-500 bg-primary-50/50"
                      : "border-ink-200 hover:border-ink-300"
                  )}
                >
                  <span className="block text-sm font-semibold text-navy-900">
                    {t.label}
                  </span>
                  <span className="block text-xs text-ink-500">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">
                Valor {type === "quota" ? "por cota" : ""} (R$)
              </Label>
              <Input
                id="price"
                name="price"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150,00"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Lua de mel"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Ajude o casal a realizar esse sonho..."
              className="min-h-20"
            />
          </div>

          <div>
            <Label htmlFor="image_url">Foto (URL, opcional)</Label>
            <Input id="image_url" name="image_url" type="url" placeholder="https://..." />
          </div>

          <AddButton />
        </Card>
      </form>

      {/* Lista de presentes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">
            Sua lista ({gifts.length})
          </h2>
        </div>

        {gifts.length === 0 ? (
          <Card className="border-dashed py-12 text-center text-ink-500">
            <Gift size={28} className="mx-auto text-ink-300" />
            <p className="mt-3">Nenhum presente ainda.</p>
            <p className="text-sm">Adicione o primeiro usando o formulário ao lado.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {gifts.map((g) => {
              const Icon = g.category?.toLowerCase().includes("lua")
                ? Plane
                : g.type === "quota"
                  ? PiggyBank
                  : Gift;
              return (
                <Card
                  key={g.id}
                  className={cn(
                    "flex items-center gap-4 p-4",
                    !g.active && "opacity-60"
                  )}
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-navy-900">{g.title}</p>
                      {g.type === "quota" && <Badge variant="gold">Cota</Badge>}
                      {!g.active && <Badge variant="neutral">Oculto</Badge>}
                    </div>
                    <p className="text-sm text-ink-500">
                      {BRL.format(Number(g.price))}
                      {g.category ? ` · ${g.category}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <form action={toggleGiftActive}>
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="active" value={(!g.active).toString()} />
                      <button
                        type="submit"
                        title={g.active ? "Ocultar do site" : "Mostrar no site"}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-navy-900"
                      >
                        {g.active ? <Eye size={17} /> : <EyeOff size={17} />}
                      </button>
                    </form>
                    <form action={deleteGift}>
                      <input type="hidden" name="id" value={g.id} />
                      <button
                        type="submit"
                        title="Excluir"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-danger-50 hover:text-danger-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </form>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
