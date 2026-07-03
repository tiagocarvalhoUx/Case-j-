import Image from "next/image";
import logoLockup from "@/logo/case-ja-2.png";
import { cn } from "@/lib/utils";

/**
 * Logo oficial Case-já (lockup horizontal: monograma + wordmark).
 * `light` aplica um filtro que renderiza a marca em branco para uso
 * sobre fundos escuros (o PNG tem fundo transparente).
 */
export function Logo({
  className,
  light = false,
  priority = false,
}: {
  className?: string;
  light?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={logoLockup}
      alt="Case-já"
      priority={priority}
      className={cn(
        "h-9 w-auto select-none",
        light && "brightness-0 invert",
        className
      )}
    />
  );
}

/**
 * Marca reconstruída em SVG (anel de check + coração dourado).
 * Mantida para usos icônicos onde só o símbolo é necessário
 * (favicons, selos). A cor do anel segue `currentColor`.
 */
export function LogoMark({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8 text-primary-600", className)}
      {...props}
    >
      <path
        d="M40 15.5C36.5 8.9 29.8 4.6 22 4.6 11.2 4.6 2.6 13.2 2.6 24S11.2 43.4 22 43.4 41.4 34.8 41.4 24"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M15 23.5 21.5 30 44 7"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 20.4c-1.2-2.5-4.9-2.3-5.6.5-.5 1.9 1 3.7 2.6 5 .9.7 2 1.5 3 2.4 1-0.9 2.1-1.7 3-2.4 1.6-1.3 3.1-3.1 2.6-5-.7-2.8-4.4-3-5.6-.5Z"
        className="fill-gold-400"
      />
    </svg>
  );
}
