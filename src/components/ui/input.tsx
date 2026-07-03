import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-sm text-navy-900 shadow-xs transition-colors",
        "placeholder:text-ink-400",
        "focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100",
        "disabled:cursor-not-allowed disabled:bg-ink-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
