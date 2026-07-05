/**
 * Checklist clássico de planejamento de casamento (pt-BR).
 * Os prazos são calculados de trás pra frente a partir da data do casamento.
 * `monthsBefore` aceita frações para semanas (0.5 ≈ 15 dias, 0.25 ≈ 1 semana).
 */

export interface ChecklistItem {
  monthsBefore: number;
  phase: string;
  title: string;
}

export const WEDDING_CHECKLIST: ChecklistItem[] = [
  // 12 meses
  { monthsBefore: 12, phase: "12 meses antes", title: "Definir o orçamento total do casamento" },
  { monthsBefore: 12, phase: "12 meses antes", title: "Escolher a data e o estilo da celebração" },
  { monthsBefore: 12, phase: "12 meses antes", title: "Montar a lista preliminar de convidados" },
  // 10 meses
  { monthsBefore: 10, phase: "10 meses antes", title: "Reservar o local da cerimônia e da festa" },
  { monthsBefore: 10, phase: "10 meses antes", title: "Contratar assessoria/cerimonial" },
  // 9 meses
  { monthsBefore: 9, phase: "9 meses antes", title: "Contratar o buffet" },
  { monthsBefore: 9, phase: "9 meses antes", title: "Contratar fotógrafo e filmagem" },
  // 8 meses
  { monthsBefore: 8, phase: "8 meses antes", title: "Contratar banda ou DJ" },
  { monthsBefore: 8, phase: "8 meses antes", title: "Convidar padrinhos e madrinhas" },
  // 7 meses
  { monthsBefore: 7, phase: "7 meses antes", title: "Escolher o vestido da noiva (iniciar provas)" },
  { monthsBefore: 7, phase: "7 meses antes", title: "Definir o traje do noivo" },
  // 6 meses
  { monthsBefore: 6, phase: "6 meses antes", title: "Publicar o site do casamento e a lista de presentes" },
  { monthsBefore: 6, phase: "6 meses antes", title: "Enviar o save the date aos convidados" },
  { monthsBefore: 6, phase: "6 meses antes", title: "Contratar decoração e flores" },
  // 5 meses
  { monthsBefore: 5, phase: "5 meses antes", title: "Contratar doces e bolo" },
  { monthsBefore: 5, phase: "5 meses antes", title: "Planejar a lua de mel" },
  // 4 meses
  { monthsBefore: 4, phase: "4 meses antes", title: "Comprar as alianças" },
  { monthsBefore: 4, phase: "4 meses antes", title: "Encomendar convites (se houver impressos)" },
  // 3 meses
  { monthsBefore: 3, phase: "3 meses antes", title: "Degustação do buffet e do bolo" },
  { monthsBefore: 3, phase: "3 meses antes", title: "Prova do vestido e ajustes" },
  { monthsBefore: 3, phase: "3 meses antes", title: "Comprar lembrancinhas" },
  // 2 meses
  { monthsBefore: 2, phase: "2 meses antes", title: "Enviar os convites" },
  { monthsBefore: 2, phase: "2 meses antes", title: "Teste de cabelo e maquiagem" },
  { monthsBefore: 2, phase: "2 meses antes", title: "Dar entrada na documentação do casamento civil" },
  // 1 mês
  { monthsBefore: 1, phase: "1 mês antes", title: "Cobrar confirmação de presença dos pendentes" },
  { monthsBefore: 1, phase: "1 mês antes", title: "Montar o mapa de mesas" },
  { monthsBefore: 1, phase: "1 mês antes", title: "Fechar o cronograma do grande dia com o cerimonial" },
  // 15 dias
  { monthsBefore: 0.5, phase: "15 dias antes", title: "Confirmar todos os fornecedores" },
  { monthsBefore: 0.5, phase: "15 dias antes", title: "Prova final do vestido" },
  // 1 semana
  { monthsBefore: 0.25, phase: "Semana do casamento", title: "Entregar a lista final de convidados ao buffet" },
  { monthsBefore: 0.25, phase: "Semana do casamento", title: "Separar documentos, alianças e itens do dia" },
  { monthsBefore: 0.03, phase: "Semana do casamento", title: "Ensaiar, respirar e descansar 💛" },
];

/** Calcula a data-limite de um item a partir da data do casamento. */
export function dueDateFor(weddingDate: string, monthsBefore: number): string {
  const d = new Date(`${weddingDate}T00:00:00`);
  d.setDate(d.getDate() - Math.round(monthsBefore * 30));
  return d.toISOString().slice(0, 10);
}
