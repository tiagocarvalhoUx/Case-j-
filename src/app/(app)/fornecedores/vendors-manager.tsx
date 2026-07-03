"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import {
  Loader2,
  Plus,
  Trash2,
  Store,
  MessageCircle,
  AtSign,
} from "lucide-react";
import { addVendor, setVendorStatus, deleteVendor, type VendorState } from "./actions";
import type { Vendor, VendorStatus } from "@/lib/supabase/types";
import {
  LuxeCard,
  LuxeButton,
  LuxeInput,
  LuxeLabel,
  LuxeTextarea,
} from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const STATUS: { key: VendorStatus; label: string }[] = [
  { key: "researching", label: "Pesquisando" },
  { key: "quoted", label: "Orçamento" },
  { key: "hired", label: "Contratado" },
  { key: "paid", label: "Pago" },
];

const CATEGORIES = [
  "Buffet",
  "Fotografia",
  "Música",
  "Decoração",
  "Espaço",
  "Cerimonial",
  "Doces & Bolo",
  "Convites",
  "Beleza",
];

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
      Adicionar fornecedor
    </LuxeButton>
  );
}

export function VendorsManager({ vendors }: { vendors: Vendor[] }) {
  const [state, formAction] = useActionState<VendorState, FormData>(addVendor, {});

  const totals = useMemo(() => {
    const hiredOrPaid = vendors.filter((v) => v.status === "hired" || v.status === "paid");
    return {
      count: vendors.length,
      hired: hiredOrPaid.length,
      committed: hiredOrPaid.reduce((s, v) => s + Number(v.price ?? 0), 0),
      paid: vendors
        .filter((v) => v.status === "paid")
        .reduce((s, v) => s + Number(v.price ?? 0), 0),
    };
  }, [vendors]);

  const stats = [
    { label: "Fornecedores", value: String(totals.count) },
    { label: "Contratados", value: String(totals.hired) },
    { label: "Custo contratado", value: BRL.format(totals.committed) },
    { label: "Já pago", value: BRL.format(totals.paid) },
  ];

  return (
    <div className="space-y-6">
      {/* Resumo financeiro */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <LuxeCard key={s.label} className="p-5">
            <p className="font-serif-luxe text-2xl font-light text-luxe-gold sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-luxe-muted">{s.label}</p>
          </LuxeCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Adicionar */}
        <form action={formAction}>
          <LuxeCard className="space-y-5">
            <h2 className="font-serif-luxe text-xl text-luxe-cream">Novo fornecedor</h2>
            {state.success && (
              <div className="rounded-xl border border-luxe-gold/25 bg-luxe-gold/10 px-4 py-3 text-sm text-luxe-gold">
                Fornecedor adicionado!
              </div>
            )}
            {state.error && (
              <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {state.error}
              </div>
            )}

            <div>
              <LuxeLabel htmlFor="v-name">Nome</LuxeLabel>
              <LuxeInput id="v-name" name="name" placeholder="Ex.: Buffet Jardim das Flores" required />
            </div>

            <div>
              <LuxeLabel htmlFor="v-cat">Categoria</LuxeLabel>
              <LuxeInput id="v-cat" name="category" list="vendor-categories" placeholder="Buffet" />
              <datalist id="vendor-categories">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <LuxeLabel htmlFor="v-phone">WhatsApp</LuxeLabel>
                <LuxeInput id="v-phone" name="phone" inputMode="tel" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <LuxeLabel htmlFor="v-price">Valor (R$)</LuxeLabel>
                <LuxeInput id="v-price" name="price" inputMode="decimal" placeholder="8.500,00" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <LuxeLabel htmlFor="v-contact">Contato</LuxeLabel>
                <LuxeInput id="v-contact" name="contact_name" placeholder="Nome do responsável" />
              </div>
              <div>
                <LuxeLabel htmlFor="v-insta">Instagram</LuxeLabel>
                <LuxeInput id="v-insta" name="instagram" placeholder="@fornecedor" />
              </div>
            </div>

            <div>
              <LuxeLabel htmlFor="v-notes">Anotações</LuxeLabel>
              <LuxeTextarea id="v-notes" name="notes" placeholder="Condições, datas de pagamento..." className="min-h-20" />
            </div>

            <AddButton />
          </LuxeCard>
        </form>

        {/* Lista */}
        <div>
          <h2 className="mb-3 font-serif-luxe text-xl text-luxe-cream">
            Seus fornecedores ({vendors.length})
          </h2>

          {vendors.length === 0 ? (
            <LuxeCard className="py-12 text-center text-luxe-muted">
              <Store size={28} strokeWidth={1.25} className="mx-auto text-luxe-muted/50" />
              <p className="mt-3">Nenhum fornecedor ainda.</p>
              <p className="text-sm">Adicione o primeiro usando o formulário ao lado.</p>
            </LuxeCard>
          ) : (
            <div className="space-y-3">
              {vendors.map((v) => {
                const digits = (v.phone || "").replace(/\D/g, "");
                const wa = digits
                  ? `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`
                  : null;
                const insta = v.instagram
                  ? `https://instagram.com/${v.instagram.replace(/^@/, "")}`
                  : null;
                return (
                  <LuxeCard key={v.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-luxe-cream">{v.name}</p>
                          {v.category && (
                            <span className="rounded-full border border-luxe-gold/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-luxe-gold">
                              {v.category}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-luxe-muted/80">
                          {[v.contact_name, v.price != null ? BRL.format(Number(v.price)) : null]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                        {v.notes && (
                          <p className="mt-1 text-xs italic text-luxe-muted/70">{v.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-luxe-muted hover:bg-white/5 hover:text-luxe-gold"
                          >
                            <MessageCircle size={15} strokeWidth={1.75} />
                          </a>
                        )}
                        {insta && (
                          <a
                            href={insta}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Instagram"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-luxe-muted hover:bg-white/5 hover:text-luxe-gold"
                          >
                            <AtSign size={15} strokeWidth={1.75} />
                          </a>
                        )}
                        <form action={deleteVendor}>
                          <input type="hidden" name="id" value={v.id} />
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

                    {/* Pipeline de status */}
                    <div className="mt-3 flex gap-1.5">
                      {STATUS.map((s) => (
                        <form key={s.key} action={setVendorStatus} className="flex-1">
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="status" value={s.key} />
                          <button
                            type="submit"
                            className={cn(
                              "w-full rounded-full border py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors",
                              v.status === s.key
                                ? "border-luxe-gold bg-luxe-gold/10 text-luxe-gold"
                                : "border-white/10 text-luxe-muted/70 hover:border-white/25 hover:text-luxe-cream"
                            )}
                          >
                            {s.label}
                          </button>
                        </form>
                      ))}
                    </div>
                  </LuxeCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
