import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function Footer({ text }: { text: string }) {
  return (
    <footer className="container-page mt-16 pb-[max(1rem,env(safe-area-inset-bottom))] sm:mt-24 sm:pb-6">
      <div className="glass-panel flex flex-col items-start justify-between gap-5 rounded-[24px] px-5 py-6 sm:flex-row sm:items-center sm:gap-6 sm:rounded-[28px] sm:px-6 sm:py-7">
        <div className="w-full sm:w-auto">
          <Logo />
          <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">{text}</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-1 text-center text-xs font-semibold text-muted-foreground sm:flex sm:w-auto sm:gap-2 sm:text-left sm:text-sm">
          <Link className="rounded-xl px-2 py-2.5 transition hover:bg-white hover:text-primary sm:px-3 sm:py-2" href="/campaigns">Campaigns</Link>
          <Link className="rounded-xl px-2 py-2.5 transition hover:bg-white hover:text-primary sm:px-3 sm:py-2" href="/privacy">Privacy</Link>
          <Link className="rounded-xl px-2 py-2.5 transition hover:bg-white hover:text-primary sm:px-3 sm:py-2" href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
