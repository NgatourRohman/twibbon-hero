import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/10 bg-violet-50/80 px-3 py-1 text-xs font-bold text-accent-foreground shadow-[inset_0_1px_0_white] backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
