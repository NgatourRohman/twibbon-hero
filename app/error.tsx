"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page grid min-h-[68vh] place-items-center py-16 text-center">
      <div className="glass-panel premium-border max-w-xl rounded-[24px] px-5 py-10 sm:rounded-[32px] sm:px-14 sm:py-14">
        <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-gradient-to-br from-amber-100 to-white text-amber-700 shadow-clay">
          <AlertTriangle className="size-7" />
        </span>
        <h1 className="gradient-text mt-6 font-[var(--font-display)] text-[1.75rem] font-extrabold sm:text-3xl">
          Something went off-script
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          We could not load this page. Your data is safe—please try again.
        </p>
        <Button className="mt-7" onClick={reset}>
          <RotateCcw className="size-4" /> Try again
        </Button>
      </div>
    </div>
  );
}
