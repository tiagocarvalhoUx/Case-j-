import Link from "next/link";
import { Gift, Users, Check } from "lucide-react";
import { LuxeEyebrow, LuxeTitle } from "@/components/luxe/ui";

const highlights = [
  { icon: Gift, text: "Lista de presentes que vira dinheiro na sua conta" },
  { icon: Users, text: "Convidados e RSVP organizados sem planilhas" },
  { icon: Check, text: "Site do casamento no ar em minutos" },
];

/* eslint-disable @next/next/no-img-element */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-luxe-black text-luxe-cream lg:grid-cols-2">
      {/* Painel de marca (desktop) */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-14">
        <img
          src="/background/hero-luxe.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxe-black via-luxe-black/85 to-luxe-black/50" />

        <Link href="/" className="relative w-fit">
          <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-24" />
        </Link>

        <div className="relative">
          <LuxeEyebrow>Wedding Planning</LuxeEyebrow>
          <LuxeTitle className="mt-6 max-w-md text-4xl">
            Tudo o que vocês precisam para o <span className="text-luxe-gold">grande dia</span>.
          </LuxeTitle>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-luxe-muted">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-luxe-gold/30 text-luxe-gold">
                  <h.icon size={16} strokeWidth={1.5} />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-serif-luxe text-lg italic text-luxe-cream/70">
          “Organizamos todo o casamento pelo Case-já e recebemos os presentes
          direto na conta.” — Marina &amp; Rafael
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-col">
        <div className="p-6 lg:hidden">
          <Link href="/" className="w-fit">
            <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-16" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
