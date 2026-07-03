"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const links = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#presentes", label: "Lista de presentes" },
  { href: "#precos", label: "Preços" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/60 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="Case-já — início">
          <Logo priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-600 transition-colors hover:text-navy-900"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="/entrar"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Entrar
          </a>
          <a href="/criar" className={buttonVariants({ size: "sm" })}>
            Criar meu site grátis
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-ink-200/60 bg-white md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
        style={{ transition: "max-height 0.3s var(--ease-out-soft)" }}
      >
        <Container className="flex flex-col gap-1 py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <a
              href="/entrar"
              className="rounded-full px-3 py-2.5 text-center text-sm font-semibold text-navy-900 hover:bg-ink-100"
            >
              Entrar
            </a>
            <a href="/criar" className={buttonVariants()}>
              Criar meu site grátis
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
