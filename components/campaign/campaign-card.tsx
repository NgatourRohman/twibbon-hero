import Link from "next/link";
import { ArrowUpRight, ImageIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Campaign, Locale } from "@/lib/types";
import { formatNumber, getPublicUrl } from "@/lib/utils";

export function CampaignCard({
  campaign,
  locale,
}: {
  campaign: Campaign;
  locale: Locale;
}) {
  const banner = getPublicUrl("campaign-banners", campaign.banner_path);
  const count = campaign.campaign_usages?.[0]?.count ?? 0;
  return (
    <Link
      href={`/campaigns/${campaign.slug}`}
      className="group glass-panel premium-border overflow-hidden rounded-[22px] transition-all duration-500 hover:-translate-y-2 hover:rotate-[.15deg] hover:bg-white/85 hover:shadow-[0_30px_70px_-30px_rgba(45,35,100,.4)] sm:rounded-[26px]"
    >
      <div className="relative m-1.5 aspect-[16/10] overflow-hidden rounded-[17px] bg-gradient-to-br from-violet-100 via-sky-50 to-amber-100 sm:m-2 sm:rounded-[20px]">
        {banner ? (
          // Public Supabase assets are configured in next.config; img also supports custom Supabase domains.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner}
            alt={campaign.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <ImageIcon className="size-10 text-primary/30" />
          </div>
        )}
        {campaign.is_featured && (
          <Badge className="absolute left-3 top-3 border-white/80 bg-white/85 text-primary shadow-soft backdrop-blur-xl">
            Featured
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#15122b]/20 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="px-5 pb-5 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {locale === "id"
              ? campaign.categories?.name_id
              : campaign.categories?.name_en}
          </span>
          <span className="grid size-8 place-items-center rounded-xl bg-violet-50 text-primary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <h3 className="line-clamp-2 font-[var(--font-display)] text-lg font-bold leading-snug">
          {campaign.title}
        </h3>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="grid size-7 place-items-center rounded-lg bg-slate-100/80"><Users className="size-3.5" /></span>
          {formatNumber(count, locale)} {locale === "id" ? "pendukung" : "supporters"}
        </div>
      </div>
    </Link>
  );
}
