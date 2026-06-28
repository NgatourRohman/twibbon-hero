import { CampaignCard } from "@/components/campaign/campaign-card";
import type { Campaign, Locale } from "@/lib/types";

export function CampaignGrid({
  campaigns,
  locale,
  emptyText,
}: {
  campaigns: Campaign[];
  locale: Locale;
  emptyText: string;
}) {
  if (!campaigns.length) {
    return (
      <div className="glass-panel col-span-full rounded-[28px] border-dashed px-6 py-20 text-center">
        <div className="mx-auto mb-4 size-14 rounded-2xl bg-gradient-to-br from-violet-100 to-white shadow-clay" />
        <p className="text-sm font-medium text-muted-foreground">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} locale={locale} />
      ))}
    </div>
  );
}
