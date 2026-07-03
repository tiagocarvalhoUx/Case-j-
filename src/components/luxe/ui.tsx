import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ============================================================
   Primitivas do tema Luxury Minimalism (dark gold).
   Preto #050505 · Dourado #D4AF37 · Esmeralda · Creme #F7F4EF
   ============================================================ */

/** Fundo de página escuro com brilho dourado sutil. */
export function LuxePage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative min-h-screen bg-luxe-black text-luxe-cream", className)}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.06), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

/** Card escuro com borda dourada suave e glow no hover. */
export function LuxeCard({
  className,
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-luxe-gold/12 bg-luxe-card/80 p-6 backdrop-blur-sm transition-all duration-300",
        "shadow-[0_20px_80px_rgba(0,0,0,0.25)]",
        hover &&
          "hover:-translate-y-1 hover:border-luxe-gold/25 hover:shadow-[0_0_40px_rgba(212,175,55,0.10)]",
        className
      )}
      {...props}
    />
  );
}

/** Eyebrow dourado (texto + linha), estilo do brief. */
export function LuxeEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-4", className)}>
      <span className="font-serif-luxe text-xs uppercase tracking-[0.4em] text-luxe-gold">
        {children}
      </span>
      <span className="h-px w-12 bg-luxe-gold/50" />
    </span>
  );
}

/** Título em Cormorant. */
export function LuxeTitle({
  className,
  as: Tag = "h1",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag
      className={cn(
        "font-serif-luxe font-light leading-tight tracking-[-0.01em] text-luxe-cream",
        className
      )}
      {...props}
    />
  );
}

export const luxeButton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luxe-gold disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        gold: "border border-luxe-gold bg-luxe-gold text-luxe-black hover:bg-luxe-gold-soft hover:border-luxe-gold-soft",
        outline:
          "border border-luxe-gold/60 text-luxe-gold hover:bg-luxe-gold hover:text-luxe-black",
        ghost: "text-luxe-cream/80 hover:text-luxe-gold",
      },
      size: {
        sm: "h-9 px-5 text-[11px]",
        md: "h-11 px-8 text-xs",
        lg: "h-13 px-10 text-sm",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  }
);

export interface LuxeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxeButton> {}

export const LuxeButton = React.forwardRef<HTMLButtonElement, LuxeButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(luxeButton({ variant, size }), className)} {...props} />
  )
);
LuxeButton.displayName = "LuxeButton";

/** Link com seta e linha dourada animada (estilo "COMECE A PLANEJAR →"). */
export function LuxeArrowLink({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "group inline-flex w-fit items-center gap-4 font-serif-luxe text-sm uppercase tracking-[0.3em] text-luxe-gold",
        className
      )}
      {...props}
    >
      {children}
      <span className="flex items-center">
        <span className="h-px w-10 bg-luxe-gold transition-all duration-300 group-hover:w-16 group-hover:bg-luxe-gold-soft" />
      </span>
    </a>
  );
}

export function LuxeLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-2 block font-sans text-[11px] uppercase tracking-[0.2em] text-luxe-muted",
        className
      )}
      {...props}
    />
  );
}

const fieldBase =
  "w-full rounded-xl border border-white/[0.06] bg-[#0f0f0f] px-4 text-sm text-luxe-cream transition-colors placeholder:text-luxe-muted/50 focus:border-luxe-gold focus:outline-none focus:ring-[3px] focus:ring-[rgba(212,175,55,0.15)] disabled:opacity-50";

export const LuxeInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input ref={ref} type={type} className={cn("h-12", fieldBase, className)} {...props} />
));
LuxeInput.displayName = "LuxeInput";

export const LuxeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("min-h-24 py-3", fieldBase, className)} {...props} />
));
LuxeTextarea.displayName = "LuxeTextarea";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em]",
  {
    variants: {
      variant: {
        gold: "border border-luxe-gold/30 bg-luxe-gold/10 text-luxe-gold",
        emerald: "border border-luxe-gold/20 bg-luxe-emerald text-luxe-gold-soft",
        muted: "border border-white/10 bg-white/5 text-luxe-muted",
      },
    },
    defaultVariants: { variant: "gold" },
  }
);

export function LuxeBadge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Divisória ornamental dourada (asset). */
export function LuxeOrnament({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/luxe/ornament.png"
      alt=""
      aria-hidden
      className={cn("w-16 opacity-80", className)}
    />
  );
}
