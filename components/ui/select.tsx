import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full appearance-none rounded-2xl border border-white/80 bg-white/70 px-4 text-base shadow-[inset_0_1px_2px_rgba(34,30,70,.05)] outline-none backdrop-blur-xl transition-all hover:bg-white focus:border-primary/45 focus:ring-4 focus:ring-primary/10 sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
