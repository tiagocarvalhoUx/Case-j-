"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserWedding } from "@/lib/weddings";
import { WEDDING_CHECKLIST, dueDateFor } from "@/lib/checklist";

export type TaskState = { success?: boolean; error?: string };

/** Gera o checklist clássico com prazos calculados pela data do casamento. */
export async function seedChecklist(): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const supabase = await createClient();

  // Evita duplicar: só semeia se ainda não há tarefas.
  const { count } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("wedding_id", wedding.id);
  if ((count ?? 0) > 0) return;

  const rows = WEDDING_CHECKLIST.map((item, i) => ({
    wedding_id: wedding.id,
    title: item.title,
    category: item.phase,
    due_date: wedding.wedding_date
      ? dueDateFor(wedding.wedding_date, item.monthsBefore)
      : null,
    sort_order: i,
  }));

  await supabase.from("tasks").insert(rows);
  revalidatePath("/cronograma");
  revalidatePath("/painel");
}

/** Adiciona uma tarefa própria. */
export async function addTask(
  _prev: TaskState,
  formData: FormData
): Promise<TaskState> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const title = String(formData.get("title") || "").trim();
  if (title.length < 2) return { error: "Descreva a tarefa." };

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    wedding_id: wedding.id,
    title,
    category: "Minhas tarefas",
    due_date: String(formData.get("due_date") || "") || null,
    sort_order: 999,
  });

  if (error) return { error: "Não foi possível adicionar a tarefa." };
  revalidatePath("/cronograma");
  revalidatePath("/painel");
  return { success: true };
}

/** Marca/desmarca uma tarefa como concluída. */
export async function toggleTask(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const done = formData.get("done") === "true";

  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({ done })
    .eq("id", id)
    .eq("wedding_id", wedding.id);

  revalidatePath("/cronograma");
  revalidatePath("/painel");
}

/** Exclui uma tarefa. */
export async function deleteTask(formData: FormData): Promise<void> {
  const wedding = await getUserWedding();
  if (!wedding) redirect("/onboarding");

  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id).eq("wedding_id", wedding.id);

  revalidatePath("/cronograma");
  revalidatePath("/painel");
}
