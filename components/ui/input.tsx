import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full min-w-0 rounded-2xl border border-white/80 bg-white/70 px-4 text-base shadow-[inset_0_1px_2px_rgba(34,30,70,.05),0_8px_24px_-20px_rgba(35,30,80,.55)] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-muted-foreground/75 hover:bg-white/85 focus:border-primary/45 focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-50 sm:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
