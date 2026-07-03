import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteção redundante ao middleware (defesa em profundidade).
  if (!user) redirect("/entrar");

  const coupleNames =
    (user.user_metadata?.couple_names as string | undefined) || user.email;

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-ink-200/70 bg-white">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/painel" aria-label="Painel Case-já">
            <Logo className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-500 sm:inline">
              {coupleNames}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-navy-900"
              >
                <LogOut size={16} /> Sair
              </button>
            </form>
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}
