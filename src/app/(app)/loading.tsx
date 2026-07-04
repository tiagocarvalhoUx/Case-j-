/**
 * Loading instantâneo das telas do app: aparece no momento do clique,
 * enquanto o servidor busca os dados — elimina a sensação de "clique morto".
 */
export default function AppLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
      <span
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-2 border-luxe-gold/20 border-t-luxe-gold"
      />
      <p className="font-serif-luxe text-xs uppercase tracking-[0.4em] text-luxe-gold/80">
        Case-já
      </p>
    </div>
  );
}
