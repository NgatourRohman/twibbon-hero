import Link from "next/link";
import { Compass, LayoutDashboard, LogIn, Menu, Plus } from "lucide-react";

export function MobileMenu({
  signedIn,
  labels,
}: {
  signedIn: boolean;
  labels: {
    explore: string;
    dashboard: string;
    create: string;
    login: string;
  };
}) {
  return (
    <details className="group relative md:hidden">
      <summary
        className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-white/70 bg-white/60 shadow-sm transition active:scale-95 [&::-webkit-details-marker]:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </summary>
      <div className="glass-panel absolute right-0 top-12 z-[70] w-56 origin-top-right rounded-[20px] p-2 shadow-[0_24px_60px_-24px_rgba(28,22,70,.55)]">
        <Link
          href="/campaigns"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition hover:bg-white"
        >
          <Compass className="size-4 text-primary" />
          {labels.explore}
        </Link>
        {signedIn && (
          <>
            <Link
              href="/dashboard"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition hover:bg-white"
            >
              <LayoutDashboard className="size-4 text-primary" />
              {labels.dashboard}
            </Link>
            <Link
              href="/campaigns/new"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition hover:bg-white"
            >
              <Plus className="size-4 text-primary" />
              {labels.create}
            </Link>
          </>
        )}
        {!signedIn && (
          <Link
            href="/login"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition hover:bg-white"
          >
            <LogIn className="size-4 text-primary" />
            {labels.login}
          </Link>
        )}
      </div>
    </details>
  );
}
