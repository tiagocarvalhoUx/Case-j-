/**
 * Temas visuais do site público do casamento. As classes são literais para
 * que o Tailwind as inclua no build (não montar nomes dinamicamente).
 *
 * O hero é sempre escuro (foto com overlay ou gradiente) para legibilidade;
 * o tema define o ACENTO e, no caso do Clean, o corpo do site fica claro:
 * - heroDark: fundo do hero quando o casal não tem foto de capa
 * - heroText: cor do nome/eyebrow sobre o hero (sempre sobre fundo escuro)
 * - textDark: cor de destaque no corpo (eyebrows, preços)
 * - chipDark: chip da contagem regressiva (sobre o hero)
 * - btnDark: botão "Presentear"
 * - light: corpo do site claro (marfim) em vez de preto
 */
export type ThemeKey = "classic" | "romantic" | "modern" | "garden" | "clean";

export interface Theme {
  key: ThemeKey;
  name: string;
  swatch: string; // amostra no editor
  heroDark: string;
  heroText: string;
  textDark: string;
  chipDark: string;
  btnDark: string;
  light: boolean;
}

export const themes: Record<ThemeKey, Theme> = {
  classic: {
    key: "classic",
    name: "Clássico",
    swatch: "bg-gradient-to-br from-[#3757c4] to-[#0e1d42]",
    heroDark: "bg-gradient-to-b from-[#1b3a8f] via-[#0e1d42] to-luxe-black",
    heroText: "text-[#a7bdff]",
    textDark: "text-[#a7bdff]",
    chipDark: "border-[#a7bdff]/40 bg-[#a7bdff]/10 text-[#cdd9ff]",
    btnDark:
      "border-[#a7bdff]/60 text-[#a7bdff] hover:bg-[#a7bdff] hover:text-luxe-black",
    light: false,
  },
  romantic: {
    key: "romantic",
    name: "Romântico",
    swatch: "bg-gradient-to-br from-[#e0708b] to-[#5a1f31]",
    heroDark: "bg-gradient-to-b from-[#8f2f4a] via-[#45182a] to-luxe-black",
    heroText: "text-[#f4aebd]",
    textDark: "text-[#f4aebd]",
    chipDark: "border-[#f4aebd]/40 bg-[#f4aebd]/10 text-[#fbd3db]",
    btnDark:
      "border-[#f4aebd]/60 text-[#f4aebd] hover:bg-[#f4aebd] hover:text-luxe-black",
    light: false,
  },
  modern: {
    key: "modern",
    name: "Moderno",
    swatch: "bg-gradient-to-br from-[#3a3a3a] to-black",
    heroDark: "bg-gradient-to-b from-[#2c2c2c] via-[#161616] to-luxe-black",
    heroText: "text-luxe-gold",
    textDark: "text-luxe-gold",
    chipDark: "border-luxe-gold/40 bg-luxe-gold/10 text-luxe-gold-soft",
    btnDark:
      "border-luxe-gold/60 text-luxe-gold hover:bg-luxe-gold hover:text-luxe-black",
    light: false,
  },
  garden: {
    key: "garden",
    name: "Jardim",
    swatch: "bg-gradient-to-br from-[#18a06b] to-[#083425]",
    heroDark: "bg-gradient-to-b from-[#0f6b45] via-[#083425] to-luxe-black",
    heroText: "text-[#7fe3b4]",
    textDark: "text-[#7fe3b4]",
    chipDark: "border-[#7fe3b4]/40 bg-[#7fe3b4]/10 text-[#b5f0d3]",
    btnDark:
      "border-[#7fe3b4]/60 text-[#7fe3b4] hover:bg-[#7fe3b4] hover:text-luxe-black",
    light: false,
  },
  clean: {
    key: "clean",
    name: "Clean",
    swatch: "bg-gradient-to-br from-[#faf7f2] to-[#d8cdbb]",
    heroDark: "bg-gradient-to-b from-[#3a332a] via-[#26211b] to-[#1a1611]",
    heroText: "text-[#e9c87a]",
    textDark: "text-[#9a7325]",
    chipDark: "border-[#e9c87a]/40 bg-[#e9c87a]/10 text-[#f3e2b3]",
    btnDark:
      "border-[#9a7325]/60 text-[#9a7325] hover:bg-[#9a7325] hover:text-white",
    light: true,
  },
};

export function getTheme(key: string | null | undefined): Theme {
  return themes[(key as ThemeKey) ?? "modern"] ?? themes.modern;
}

export const themeList = Object.values(themes);
