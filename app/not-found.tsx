import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[68vh] place-items-center text-center">
      <div className="glass-panel premium-border max-w-2xl rounded-[24px] px-5 py-10 sm:rounded-[32px] sm:px-14 sm:py-14">
        <span className="mx-auto grid size-20 place-items-center rounded-[26px] bg-gradient-to-br from-violet-100 to-white text-2xl font-black text-primary shadow-clay">404</span>
        <h1 className="gradient-text mt-7 font-[var(--font-display)] text-3xl font-extrabold sm:text-4xl">
          This campaign has left the stage.
        </h1>
        <p className="mt-3 text-muted-foreground">
          It may be unpublished, removed, or the link could be incorrect.
        </p>
        <Button asChild className="mt-7">
          <Link href="/campaigns">Explore campaigns</Link>
        </Button>
      </div>
    </div>
  );
}
