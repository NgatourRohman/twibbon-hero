import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2 rounded-xl font-bold sm:gap-2.5">
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-gradient-to-br from-[#9b84ff] via-[#7355f1] to-[#4d2fc8] text-white shadow-[0_10px_24px_-10px_rgba(100,72,220,.85),inset_0_1px_0_rgba(255,255,255,.45)] transition duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 sm:size-10 sm:rounded-[15px]">
        <span className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
        <Sparkles className="relative size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-[var(--font-display)] text-base font-extrabold tracking-[-.03em] sm:text-lg">
          Twibbon<span className="text-primary">Hero</span>
        </span>
        <span className="mt-1 whitespace-nowrap bg-gradient-to-r from-slate-500 via-violet-500 to-sky-500 bg-clip-text text-[7px] font-bold uppercase tracking-[0.14em] text-transparent sm:text-[9px] sm:tracking-[0.18em]">
          by Arthur Studio
        </span>
      </span>
    </Link>
  );
}
