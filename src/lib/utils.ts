import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionalmente (clsx) e resolve conflitos do Tailwind
 * (tailwind-merge). Uso padrão em todos os componentes do design system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
