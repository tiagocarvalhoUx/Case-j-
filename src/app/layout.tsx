import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "Case-já — Planeje seu casamento com simplicidade",
    description:
      "Site do casamento, lista de presentes em dinheiro, cotas de lua de mel e gestão de convidados em uma só plataforma.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
