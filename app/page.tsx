import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  Download,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBox } from "@/components/search-box";
import { CampaignGrid } from "@/components/campaign/campaign-grid";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n";
import { getPublishedCampaigns } from "@/lib/data";

export default async function HomePage() {
  const [{ locale, t }, campaigns] = await Promise.all([
    getDictionary(),
    getPublishedCampaigns({ limit: 6 }),
  ]);
  return (
    <>
      <section className="container-page relative grid items-center gap-12 overflow-hidden py-12 sm:min-h-[720px] sm:gap-14 sm:py-16 lg:grid-cols-[1.06fr_.94fr] lg:py-24">
        <div className="pointer-events-none absolute left-[42%] top-[8%] -z-10 size-72 rounded-full bg-violet-300/20 blur-3xl" />
        <Reveal>
          <Badge className="mb-5 gap-2 border-violet-200/60 bg-white/65 px-3 py-1.5 text-primary shadow-soft backdrop-blur-xl sm:mb-7 sm:px-4 sm:py-2">
            <Sparkles className="size-3.5" /> {t.heroBadge}
          </Badge>
          <h1 className="gradient-text text-balance max-w-3xl font-[var(--font-display)] text-[2.55rem] font-extrabold leading-[1.04] tracking-[-.05em] min-[430px]:text-5xl sm:text-6xl lg:text-[4.6rem]">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
            {t.heroBody}
          </p>
          <div className="mt-7 grid gap-3 min-[430px]:flex min-[430px]:flex-wrap sm:mt-8">
            <Button asChild size="lg" className="w-full min-[430px]:w-auto">
              <Link href="/campaigns">
                {t.heroCta} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full min-[430px]:w-auto">
              <Link href="/campaigns/new">{t.heroCreate}</Link>
            </Button>
          </div>
          <div className="mt-8 max-w-2xl sm:mt-10">
            <SearchBox placeholder={t.searchPlaceholder} />
          </div>
        </Reveal>
        <Reveal delay={0.12} className="relative mx-auto w-full max-w-[320px] sm:max-w-lg">
          <div className="animate-soft-pulse absolute -left-12 top-12 size-44 rounded-full bg-amber-200/55 blur-3xl" />
          <div className="animate-soft-pulse absolute -right-12 bottom-8 size-52 rounded-full bg-violet-300/50 blur-3xl [animation-delay:1.5s]" />
          <div className="glass-panel relative rotate-2 rounded-[2.5rem] p-3 shadow-[0_45px_90px_-35px_rgba(43,31,102,.5)] transition duration-700 hover:rotate-0 hover:scale-[1.015]">
            <div className="animate-gradient rounded-[2rem] bg-gradient-to-br from-[#5741d9] via-[#8169f4] to-[#ffb067] p-3">
            <div className="relative aspect-square overflow-hidden rounded-[1.55rem] bg-[#d9d3c7]">
              <div className="absolute inset-x-[18%] bottom-0 h-[78%] rounded-t-[45%] bg-gradient-to-b from-[#263755] to-[#182238]" />
              <div className="absolute left-1/2 top-[14%] size-[34%] -translate-x-1/2 rounded-full bg-[#d6a17f]" />
              <div className="absolute inset-0 rounded-[1.8rem] border-[18px] border-white/15" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-7 pb-7 pt-20 text-white">
                <p className="text-xs font-bold uppercase tracking-[.25em]">Together we can</p>
                <p className="mt-1 font-[var(--font-display)] text-3xl font-extrabold">
                  Make a difference.
                </p>
              </div>
              <Heart className="absolute right-6 top-6 size-11 fill-white text-white drop-shadow" />
            </div>
            </div>
          </div>
          <div className="glass-panel absolute -bottom-5 left-0 flex animate-float items-center gap-2.5 rounded-[18px] p-3 sm:-bottom-6 sm:-left-8 sm:gap-3 sm:rounded-[20px] sm:p-3.5">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-100 to-white text-emerald-600 shadow-clay">
              <Check className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Community</p>
              <p className="text-sm font-bold">12.8K joined</p>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="container-page py-12 sm:py-20">
        <div className="mb-7 flex items-end justify-between sm:mb-8">
          <div>
            <p className="section-label"><Sparkles className="size-3.5" /> Trending now</p>
            <h2 className="mt-2 font-[var(--font-display)] text-[1.75rem] font-extrabold sm:text-4xl">
              {t.featured}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.featuredBody}</p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/campaigns">{t.viewAll} <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <CampaignGrid campaigns={campaigns} locale={locale} emptyText={t.empty} />
      </Reveal>

      <Reveal className="container-page py-12 sm:py-20">
        <div className="premium-border relative overflow-hidden rounded-[28px] bg-[#17152b] px-5 py-11 text-white shadow-[0_35px_80px_-35px_rgba(23,21,43,.75)] sm:rounded-[2.5rem] sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-28 size-80 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 size-72 rounded-full bg-sky-400/10 blur-3xl" />
          <h2 className="text-center font-[var(--font-display)] text-[1.7rem] font-extrabold sm:text-4xl">
            {t.howTitle}
          </h2>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-8 md:grid-cols-3">
            {[
              [Search, "01", t.howOne],
              [Camera, "02", t.howTwo],
              [Download, "03", t.howThree],
            ].map(([Icon, no, title]) => {
              const StepIcon = Icon as typeof Search;
              return (
                <div key={no as string} className="relative rounded-[22px] border border-white/10 bg-white/[.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.09] sm:rounded-3xl sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary">
                      <StepIcon className="size-5" />
                    </span>
                    <span className="text-3xl font-black text-white/15">{no as string}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold sm:mt-8">{title as string}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal className="container-page py-12 text-center sm:py-20">
        <h2 className="text-balance font-[var(--font-display)] text-3xl font-extrabold sm:text-4xl">
          {t.ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.ctaBody}</p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/campaigns/new">{t.heroCreate} <ArrowRight className="size-4" /></Link>
        </Button>
      </Reveal>
    </>
  );
}
