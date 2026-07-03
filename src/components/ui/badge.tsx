import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        brand: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-100",
        gold: "bg-gold-50 text-gold-700 ring-1 ring-inset ring-gold-200",
        neutral: "bg-ink-100 text-ink-600",
        success: "bg-success-50 text-success-600 ring-1 ring-inset ring-success-500/20",
      },
    },
    defaultVariants: { variant: "brand" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
