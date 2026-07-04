import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Client Supabase para uso no servidor (Server Components, Route Handlers,
 * Server Actions). Sincroniza a sessão via cookies do Next.
 * Memoizado por request (React.cache): múltiplas chamadas no mesmo render
 * compartilham a mesma instância.
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado de um Server Component — pode ser ignorado quando há
            // middleware atualizando a sessão.
          }
        },
      },
    }
  );
});

/**
 * Usuário autenticado, memoizado por request. Evita que layout + página +
 * helpers façam várias chamadas de rede ao Supabase Auth no mesmo render
 * (era a principal causa de lentidão na navegação entre abas).
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
