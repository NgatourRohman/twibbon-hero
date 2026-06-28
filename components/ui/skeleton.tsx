import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-violet-100 via-white to-violet-100 bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
