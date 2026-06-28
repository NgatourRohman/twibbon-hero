import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, Download, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModerationButtons } from "@/components/admin/moderation-buttons";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: campaigns, error: campaignsError }, usage, downloads, shares] = await Promise.all([
    supabase
      .from("campaigns")
      .select("*, profiles!campaigns_owner_id_fkey(full_name)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("campaign_usages").select("*", { count: "exact", head: true }),
    supabase.from("campaign_downloads").select("*", { count: "exact", head: true }),
    supabase.from("campaign_shares").select("*", { count: "exact", head: true }),
  ]);
  if (campaignsError) {
    console.error("Unable to load admin campaigns:", campaignsError.message);
  }

  return (
    <div className="container-page py-9 sm:py-12">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-white text-primary shadow-clay sm:size-14"><ShieldCheck className="size-6" /></span>
        <div>
          <p className="section-label">Administration</p>
          <h1 className="gradient-text font-[var(--font-display)] text-[1.8rem] font-extrabold tracking-[-.04em] sm:text-4xl">Campaign moderation</h1>
        </div>
      </div>
      <div className="mt-7 grid gap-3 min-[430px]:grid-cols-3 sm:mt-9 sm:gap-4">
        {[
          [Users, "Editor opens", usage.count ?? 0],
          [Download, "Downloads", downloads.count ?? 0],
          [Share2, "Shares", shares.count ?? 0],
        ].map(([Icon, label, value]) => {
          const StatIcon = Icon as typeof Users;
          return (
            <Card key={label as string} className="premium-border shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
              <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                <StatIcon className="size-5 text-primary" />
                <div><p className="text-xs text-muted-foreground">{label as string}</p><p className="text-2xl font-extrabold">{value as number}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="glass-panel mt-8 overflow-hidden rounded-[24px] sm:mt-10 sm:rounded-[28px]">
        <div className="border-b border-white/70 bg-white/35 px-6 py-5">
          <h2 className="font-[var(--font-display)] text-lg font-bold">All campaigns</h2>
        </div>
        <div className="divide-y">
          {campaignsError && (
            <div className="px-6 py-10 text-center">
              <p className="font-bold text-red-600">Campaigns could not be loaded.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {campaignsError.message}
              </p>
            </div>
          )}
          {(campaigns ?? []).map((campaign) => (
            <div key={campaign.id} className="flex flex-col justify-between gap-4 px-4 py-4 transition hover:bg-white/55 sm:px-6 sm:py-5 lg:flex-row lg:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Link href={`/campaigns/${campaign.slug}`} className="truncate font-bold hover:text-primary">{campaign.title}</Link>
                  <Badge className="shrink-0 py-0.5">{campaign.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  by {campaign.profiles?.full_name || "Unknown"} · {new Date(campaign.created_at).toLocaleDateString()}
                </p>
              </div>
              <ModerationButtons id={campaign.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
