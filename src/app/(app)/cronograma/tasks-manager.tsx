"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Trash2, Sparkles, CircleCheck, Circle } from "lucide-react";
import { seedChecklist, addTask, toggleTask, deleteTask, type TaskState } from "./actions";
import type { Task } from "@/lib/supabase/types";
import { LuxeCard, LuxeButton, LuxeInput, LuxeLabel } from "@/components/luxe/ui";
import { cn } from "@/lib/utils";

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function isOverdue(t: Task) {
  if (t.done || !t.due_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${t.due_date}T00:00:00`) < today;
}

function SeedButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={16} strokeWidth={1.5} />}
      Gerar checklist inteligente
    </LuxeButton>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <LuxeButton type="submit" disabled={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
      Adicionar
    </LuxeButton>
  );
}

export function TasksManager({ tasks }: { tasks: Task[] }) {
  const [state, formAction] = useActionState<TaskState, FormData>(addTask, {});

  const done = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  // Agrupa por fase, mantendo a ordem do checklist (sort_order).
  const groups = useMemo(() => {
    const map = new Map<string, Task[]>();
    [...tasks]
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach((t) => {
        const key = t.category ?? "Tarefas";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(t);
      });
    return [...map.entries()];
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <LuxeCard className="py-14 text-center">
        <Sparkles size={30} strokeWidth={1.25} className="mx-auto text-luxe-gold" />
        <h2 className="mt-4 font-serif-luxe text-2xl text-luxe-cream">
          Comece com o checklist inteligente
        </h2>
        <p className="mx-auto mt-2 max-w-md text-luxe-muted">
          Geramos as ~30 tarefas clássicas do planejamento de um casamento, com
          prazos calculados automaticamente a partir da sua data.
        </p>
        <form action={seedChecklist} className="mt-7">
          <SeedButton />
        </form>
      </LuxeCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progresso */}
      <LuxeCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif-luxe text-lg text-luxe-cream">
            {done} de {tasks.length} tarefas concluídas
          </p>
          <p className="text-sm text-luxe-muted">
            {progress === 100 ? "Tudo pronto para o grande dia! 🎉" : "Um passo de cada vez — vocês chegam lá."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-luxe-gold to-luxe-gold-soft transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-luxe-gold">{progress}%</span>
        </div>
      </LuxeCard>

      {/* Nova tarefa */}
      <form action={formAction}>
        <LuxeCard className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <LuxeLabel htmlFor="t-title">Nova tarefa</LuxeLabel>
            <LuxeInput id="t-title" name="title" placeholder="Ex.: Reservar transporte dos padrinhos" required />
          </div>
          <div>
            <LuxeLabel htmlFor="t-date">Prazo</LuxeLabel>
            <LuxeInput id="t-date" name="due_date" type="date" className="[color-scheme:dark] sm:w-44" />
          </div>
          <AddButton />
        </LuxeCard>
      </form>
      {state.error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {/* Fases */}
      {groups.map(([phase, items]) => (
        <div key={phase}>
          <div className="mb-3 flex items-center gap-4">
            <h2 className="font-serif-luxe text-sm uppercase tracking-[0.3em] text-luxe-gold">
              {phase}
            </h2>
            <span className="h-px flex-1 bg-luxe-gold/15" />
            <span className="text-[11px] text-luxe-muted">
              {items.filter((t) => t.done).length}/{items.length}
            </span>
          </div>
          <div className="space-y-2">
            {items.map((t) => {
              const overdue = isOverdue(t);
              return (
                <LuxeCard
                  key={t.id}
                  className={cn("flex items-center gap-3 p-4", t.done && "opacity-55")}
                >
                  <form action={toggleTask}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="done" value={(!t.done).toString()} />
                    <button
                      type="submit"
                      title={t.done ? "Desmarcar" : "Concluir"}
                      className="text-luxe-gold transition-transform hover:scale-110"
                    >
                      {t.done ? (
                        <CircleCheck size={22} strokeWidth={1.5} />
                      ) : (
                        <Circle size={22} strokeWidth={1.25} className="text-luxe-muted/60 hover:text-luxe-gold" />
                      )}
                    </button>
                  </form>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-luxe-cream", t.done && "line-through decoration-luxe-gold/40")}>
                      {t.title}
                    </p>
                  </div>
                  {t.due_date && (
                    <span
                      className={cn(
                        "shrink-0 text-[11px] uppercase tracking-[0.15em]",
                        overdue ? "font-semibold text-luxe-gold" : "text-luxe-muted"
                      )}
                    >
                      {overdue && "• "}
                      {fmt(t.due_date)}
                    </span>
                  )}
                  <form action={deleteTask}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      title="Excluir"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-luxe-muted/60 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </form>
                </LuxeCard>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
