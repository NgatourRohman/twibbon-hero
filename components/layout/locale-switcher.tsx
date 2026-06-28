"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import type { Locale } from "@/lib/types";
import { setLocale } from "@/app/locale-actions";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchLocale() {
    const nextLocale: Locale = locale === "en" ? "id" : "en";
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={pending}
      className="flex h-10 items-center gap-1.5 rounded-xl border border-white/80 bg-white/65 px-2.5 text-xs font-extrabold shadow-[0_8px_20px_-16px_rgba(35,30,80,.7),inset_0_1px_0_white] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white sm:gap-2 sm:px-3"
      aria-label="Switch language"
      aria-busy={pending}
    >
      <Languages className={`size-4 ${pending ? "animate-spin" : ""}`} />
      {locale === "en" ? "ID" : "EN"}
    </button>
  );
}
