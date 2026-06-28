import Link from "next/link";
import { LogIn, Plus } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/data";
import type { Locale } from "@/lib/types";
import type { messages } from "@/lib/i18n";

export async function Header({
  locale,
  labels,
}: {
  locale: Locale;
  labels: (typeof messages)[Locale];
}) {
  const user = hasSupabaseConfig ? await getUser() : null;
  return (
    <header className="sticky top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="container-page glass-panel flex h-[62px] items-center justify-between rounded-[19px] px-3 sm:h-[68px] sm:rounded-[22px] sm:px-5">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          <Link className="rounded-lg px-1 py-2 text-sm font-semibold text-muted-foreground transition hover:text-primary" href="/campaigns">
            {labels.navExplore}
          </Link>
          {user && (
            <Link className="rounded-lg px-1 py-2 text-sm font-semibold text-muted-foreground transition hover:text-primary" href="/dashboard">
              {labels.navDashboard}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher locale={locale} />
          <Button
            asChild
            variant={user ? "default" : "outline"}
            size="sm"
            className="hidden min-[430px]:inline-flex"
          >
            <Link href={user ? "/campaigns/new" : "/login"}>
              {user && <Plus className="size-4" />}
              {!user && <LogIn className="size-4 sm:hidden" />}
              <span className="hidden sm:inline">
                {user ? labels.navCreate : labels.navLogin}
              </span>
            </Link>
          </Button>
          <MobileMenu
            signedIn={Boolean(user)}
            labels={{
              explore: labels.navExplore,
              dashboard: labels.navDashboard,
              create: labels.navCreate,
              login: labels.navLogin,
            }}
          />
        </div>
      </div>
    </header>
  );
}
