import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CampaignForm } from "@/components/campaign/campaign-form";
import { getCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export const metadata: Metadata = { title: "Edit campaign" };

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data }, categories] = await Promise.all([
    supabase.from("campaigns").select("*, campaign_frames(*)").eq("id", (await params).id).eq("owner_id", user.id).single(),
    getCategories(),
  ]);
  if (!data) notFound();
  return (
    <div className="container-page py-9 sm:py-12">
      <div className="mb-7 sm:mb-9">
        <p className="section-label">Manage</p>
        <h1 className="gradient-text mt-2 font-[var(--font-display)] text-[2rem] font-extrabold tracking-[-.04em] sm:text-4xl">Edit campaign</h1>
      </div>
      <CampaignForm categories={categories} campaign={data as Campaign} />
    </div>
  );
}
