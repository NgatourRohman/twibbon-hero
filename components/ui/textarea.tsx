import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "min-h-32 w-full resize-y rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-base shadow-[inset_0_1px_2px_rgba(34,30,70,.05)] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-muted-foreground/75 hover:bg-white/85 focus:border-primary/45 focus:bg-white focus:ring-4 focus:ring-primary/10 sm:text-sm",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
