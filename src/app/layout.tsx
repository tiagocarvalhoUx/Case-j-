import type { Metadata, Viewport } from "next";
import {
  Inter,
  Playfair_Display,
  Great_Vibes,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Case-já — Planeje seu casamento com simplicidade",
    template: "%s · Case-já",
  },
  description:
    "Case-já é a plataforma completa para casais planejarem o casamento: site personalizado, lista de presentes em dinheiro, cotas de lua de mel, RSVP e gestão de convidados — tudo em um só lugar.",
  keywords: [
    "casamento",
    "lista de presentes",
    "site de casamento",
    "RSVP",
    "lua de mel",
    "planejamento de casamento",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://case-ja.com.br"
  ),
  applicationName: "Case-já",
  openGraph: {
    title: "Case-já — Planeje seu casamento com simplicidade",
    description:
      "Site do casamento, lista de presentes em dinheiro, cotas de lua de mel e gestão de convidados em uma só plataforma.",
    siteName: "Case-já",
    locale: "pt_BR",
    type: "website",
    // A imagem é detectada automaticamente por app/opengraph-image.jpg
  },
  twitter: {
    card: "summary_large_image",
    title: "Case-já — Planeje seu casamento com simplicidade",
    description:
      "Site do casamento, lista de presentes em dinheiro, cotas de lua de mel e gestão de convidados em uma só plataforma.",
    // A imagem é detectada automaticamente por app/twitter-image.jpg
  },
  appleWebApp: {
    capable: true,
    title: "Case-já",
    statusBarStyle: "default",
  },
  // Ícones (favicon.ico, icon.png, apple-icon.png) e manifest são detectados
  // automaticamente pelas convenções do App Router.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141c3d" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
