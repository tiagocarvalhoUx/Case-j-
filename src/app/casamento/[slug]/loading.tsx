export default function WeddingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-luxe-black">
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
