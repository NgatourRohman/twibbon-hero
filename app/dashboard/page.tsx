import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Download, Eye, LogOut, Plus, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CampaignActions } from "@/components/dashboard/campaign-actions";
import { signOut } from "@/app/dashboard/actions";
import type { Campaign } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await supabase
    .from("campaigns")
    .select("*, campaign_usages(count), campaign_downloads(count), campaign_shares(count)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const campaigns = (data ?? []) as (Campaign & {
    campaign_shares?: { count: number }[];
  })[];
  const totals = campaigns.reduce(
    (sum, item) => ({
      uses: sum.uses + (item.campaign_usages?.[0]?.count ?? 0),
      downloads: sum.downloads + (item.campaign_downloads?.[0]?.count ?? 0),
      shares: sum.shares + (item.campaign_shares?.[0]?.count ?? 0),
    }),
    { uses: 0, downloads: 0, shares: 0 },
  );

  return (
    <div className="container-page py-9 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="section-label">CREATOR SPACE</p>
          <h1 className="gradient-text mt-1 font-[var(--font-display)] text-[2rem] font-extrabold tracking-[-.04em] sm:text-4xl">Your dashboard</h1>
          <p className="mt-2 text-muted-foreground">Welcome, {user.email}</p>
        </div>
        <div className="flex w-full gap-2 min-[430px]:w-auto">
          <form action={signOut}>
            <Button variant="outline" size="icon" aria-label="Sign out"><LogOut className="size-4" /></Button>
          </form>
          <Button asChild className="flex-1 min-[430px]:flex-none"><Link href="/campaigns/new"><Plus className="size-4" /> New campaign</Link></Button>
        </div>
      </div>
      <div className="mt-7 grid gap-3 min-[430px]:grid-cols-3 sm:mt-9 sm:gap-4">
        {[
          [Eye, "Editor opens", totals.uses],
          [Download, "Downloads", totals.downloads],
          [Share2, "Shares", totals.shares],
        ].map(([Icon, label, value]) => {
          const StatIcon = Icon as typeof Eye;
          return (
            <Card key={label as string} className="group premium-border overflow-hidden shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
              <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-white text-primary shadow-clay transition group-hover:scale-105 sm:size-12 sm:rounded-2xl"><StatIcon className="size-5" /></span>
                <div><p className="text-xs text-muted-foreground">{label as string}</p><p className="text-2xl font-extrabold">{value as number}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="glass-panel mt-8 overflow-hidden rounded-[24px] sm:mt-10 sm:rounded-[28px]">
        <div className="flex items-center gap-2 border-b border-white/70 bg-white/35 px-6 py-5">
          <BarChart3 className="size-5 text-primary" />
          <h2 className="font-[var(--font-display)] text-lg font-bold">Your campaigns</h2>
        </div>
        {campaigns.length ? (
          <div className="divide-y">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition hover:bg-white/55 sm:gap-4 sm:px-6 sm:py-5">
                <div>
                  <Link href={`/campaigns/${campaign.slug}`} className="font-bold hover:text-primary">{campaign.title}</Link>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge className="py-0.5">{campaign.status}</Badge>
                    <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <CampaignActions id={campaign.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            You have not created a campaign yet.
          </div>
        )}
      </div>
    </div>
  );
}
