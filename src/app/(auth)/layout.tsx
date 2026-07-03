import Link from "next/link";
import { Check, Gift, Users } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const highlights = [
  { icon: Gift, text: "Lista de presentes que vira dinheiro na sua conta" },
  { icon: Users, text: "Convidados e RSVP organizados sem planilhas" },
  { icon: Check, text: "Site do casamento no ar em minutos" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca (desktop) */}
      <div className="relative hidden overflow-hidden bg-navy-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
        >
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary-500/40 blur-3xl" />
          <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gold-400/25 blur-3xl" />
        </div>

        <Link href="/" className="relative w-fit">
          <Logo light className="h-9 w-auto" />
        </Link>

        <div className="relative">
          <h1 className="max-w-md font-display text-3xl font-semibold leading-tight text-white">
            Tudo o que vocês precisam para o grande dia, em um só lugar.
          </h1>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-navy-100">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300">
                  <h.icon size={18} />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-navy-200">
          “Organizamos todo o casamento pelo Case-já e recebemos os presentes
          direto na conta. Simples demais.” — Marina &amp; Rafael
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-col">
        <div className="p-6 lg:hidden">
          <Link href="/" className="w-fit">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
