/**
 * Temas visuais do site público do casamento. As classes são literais para
 * que o Tailwind as inclua no build (não montar nomes dinamicamente).
 */
export type ThemeKey = "classic" | "romantic" | "modern" | "garden";

export interface Theme {
  key: ThemeKey;
  name: string;
  hero: string; // gradiente do hero
  accentText: string; // cor de destaque (texto)
  accentBg: string; // fundo de destaque (botões/badges)
  swatch: string; // amostra para o seletor
}

export const themes: Record<ThemeKey, Theme> = {
  classic: {
    key: "classic",
    name: "Clássico",
    hero: "bg-gradient-to-br from-primary-500 via-primary-600 to-navy-800",
    accentText: "text-primary-600",
    accentBg: "bg-primary-600",
    swatch: "bg-gradient-to-br from-primary-500 to-navy-800",
  },
  romantic: {
    key: "romantic",
    name: "Romântico",
    hero: "bg-gradient-to-br from-rose-400 via-rose-500 to-gold-500",
    accentText: "text-rose-500",
    accentBg: "bg-rose-500",
    swatch: "bg-gradient-to-br from-rose-400 to-gold-500",
  },
  modern: {
    key: "modern",
    name: "Moderno",
    hero: "bg-gradient-to-br from-navy-800 via-navy-900 to-ink-950",
    accentText: "text-gold-500",
    accentBg: "bg-navy-900",
    swatch: "bg-gradient-to-br from-navy-800 to-ink-950",
  },
  garden: {
    key: "garden",
    name: "Jardim",
    hero: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800",
    accentText: "text-emerald-600",
    accentBg: "bg-emerald-600",
    swatch: "bg-gradient-to-br from-emerald-500 to-teal-800",
  },
};

export function getTheme(key: string | null | undefined): Theme {
  return themes[(key as ThemeKey) ?? "classic"] ?? themes.classic;
}

export const themeList = Object.values(themes);
