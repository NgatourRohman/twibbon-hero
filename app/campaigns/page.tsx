import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPublishedCampaigns } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { CampaignGrid } from "@/components/campaign/campaign-grid";
import { SearchBox } from "@/components/search-box";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Explore campaigns" };

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [{ locale, t }, campaigns, categories] = await Promise.all([
    getDictionary(),
    getPublishedCampaigns({ query: params.q, category: params.category }),
    getCategories(),
  ]);
  return (
    <div className="container-page py-11 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label">Discover</p>
        <h1 className="gradient-text mt-3 font-[var(--font-display)] text-[2rem] font-extrabold tracking-[-.04em] sm:text-5xl">
          Find a cause you care about
        </h1>
        <div className="mt-6 flex justify-center sm:mt-8">
          <SearchBox placeholder={t.searchPlaceholder} defaultValue={params.q} />
        </div>
      </div>
      <div className="my-7 flex flex-nowrap justify-start gap-2 overflow-x-auto rounded-2xl pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:my-10 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        <Link
          href="/campaigns"
          className={cn("shrink-0 rounded-xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white", !params.category && "border-transparent bg-primary text-white shadow-glow")}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/campaigns?category=${item.slug}`}
            className={cn("shrink-0 rounded-xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white", params.category === item.slug && "border-transparent bg-primary text-white shadow-glow")}
          >
            {locale === "id" ? item.name_id : item.name_en}
          </Link>
        ))}
      </div>
      <CampaignGrid campaigns={campaigns} locale={locale} emptyText={t.empty} />
    </div>
  );
}
