import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, UserRound, Users } from "lucide-react";
import { getCampaign } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { formatNumber, getPublicUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/campaign/share-buttons";
import { TwibbonEditorLoader } from "@/components/editor/twibbon-editor-loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const campaign = await getCampaign((await params).slug);
  if (!campaign) return { title: "Campaign not found" };
  return {
    title: campaign.title,
    description: campaign.description.slice(0, 160),
    openGraph: {
      images: campaign.banner_path
        ? [getPublicUrl("campaign-banners", campaign.banner_path)!]
        : [],
    },
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [campaign, { locale }] = await Promise.all([
    getCampaign((await params).slug),
    getDictionary(),
  ]);
  if (!campaign || campaign.status !== "published") notFound();
  const frames = (campaign.campaign_frames?.length
    ? [...campaign.campaign_frames].sort((a, b) => a.position - b.position)
    : [{ id: campaign.id, label: "Frame 1", frame_path: campaign.frame_path }]
  )
    .map((frame) => ({
      id: frame.id,
      label: frame.label,
      url: getPublicUrl("campaign-frames", frame.frame_path),
    }))
    .filter((frame): frame is { id: string; label: string; url: string } =>
      Boolean(frame.url),
    );
  if (!frames.length) notFound();
  const usage = campaign.campaign_usages?.[0]?.count ?? 0;

  return (
    <div className="container-page py-9 sm:py-14">
      <div className="grid min-w-0 gap-8 sm:gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <div className="w-full min-w-0 max-w-full lg:sticky lg:top-28 lg:self-start">
          <TwibbonEditorLoader
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            frames={frames}
          />
        </div>
        <article className="glass-panel min-w-0 rounded-[24px] p-5 sm:rounded-[30px] sm:p-8 lg:self-start">
          <Badge className="px-4 py-1.5">
            {locale === "id"
              ? campaign.categories?.name_id
              : campaign.categories?.name_en}
          </Badge>
          <h1 className="gradient-text text-balance mt-4 font-[var(--font-display)] text-[2rem] font-extrabold leading-tight tracking-[-.04em] sm:mt-5 sm:text-5xl">
            {campaign.title}
          </h1>
          <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground min-[430px]:flex-row min-[430px]:flex-wrap sm:mt-6 sm:gap-3">
            <span className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 shadow-sm">
              <UserRound className="size-4" />
              {campaign.profiles?.full_name || campaign.profiles?.username || "Community"}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 shadow-sm">
              <Users className="size-4" />
              {formatNumber(usage, locale)} {locale === "id" ? "pendukung" : "supporters"}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 shadow-sm">
              <Calendar className="size-4" />
              {new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
                dateStyle: "medium",
              }).format(new Date(campaign.created_at))}
            </span>
          </div>
          <div className="my-6 h-px bg-border sm:my-8" />
          <div className="whitespace-pre-wrap leading-8 text-muted-foreground">
            {campaign.description}
          </div>
          <div className="premium-border mt-7 rounded-[22px] bg-gradient-to-br from-violet-100/80 via-white/80 to-sky-50/80 p-5 shadow-clay sm:mt-9 sm:rounded-3xl sm:p-6">
            <h2 className="font-[var(--font-display)] text-lg font-bold">
              Help this movement grow
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share this campaign with friends, family, and your community.
            </p>
            <div className="mt-4">
              <ShareButtons campaignId={campaign.id} title={campaign.title} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
