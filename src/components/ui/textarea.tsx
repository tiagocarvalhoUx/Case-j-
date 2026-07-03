import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-navy-900 shadow-xs transition-colors",
      "placeholder:text-ink-400",
      "focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100",
      "disabled:cursor-not-allowed disabled:bg-ink-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
