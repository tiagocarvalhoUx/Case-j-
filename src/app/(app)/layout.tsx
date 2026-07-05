import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { createClient, getUser } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { LuxePage } from "@/components/luxe/ui";

/* eslint-disable @next/next/no-img-element */

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/entrar");

  const coupleNames =
    (user.user_metadata?.couple_names as string | undefined) || user.email;

  return (
    <LuxePage>
      <header className="sticky top-0 z-40 border-b border-luxe-gold/12 bg-luxe-black/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/painel" aria-label="Painel Case-já">
            <img src="/luxe/logo-casaja.png" alt="Case-já" className="w-16" />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/planos"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:text-luxe-gold"
            >
              <Sparkles size={14} strokeWidth={1.5} /> Planos
            </Link>
            <span className="hidden font-serif-luxe text-sm tracking-[0.15em] text-luxe-cream/80 sm:inline">
              {coupleNames}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-luxe-gold/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-luxe-muted transition-colors hover:border-luxe-gold/50 hover:text-luxe-gold"
              >
                <LogOut size={15} strokeWidth={1.5} /> Sair
              </button>
            </form>
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </LuxePage>
  );
}
