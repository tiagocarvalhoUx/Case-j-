import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { Container } from "@/components/ui/container";
import { TasksManager } from "./tasks-manager";
import type { Task } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Cronograma",
};

export default async function CronogramaPage() {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("sort_order", { ascending: true });
  const tasks = (data ?? []) as Task[];

  return (
    <Container className="py-12">
      <Link
        href="/painel"
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:text-luxe-gold"
      >
        <ArrowLeft size={14} strokeWidth={1.5} /> Voltar ao painel
      </Link>

      <div className="mt-5 mb-9">
        <h1 className="font-serif-luxe text-4xl font-light text-luxe-cream">
          Cronograma
        </h1>
        <p className="mt-1 text-luxe-muted">
          O passo a passo do planejamento, organizado por fases — para nada
          ficar para trás.
        </p>
      </div>

      <TasksManager tasks={tasks} />
    </Container>
  );
}
