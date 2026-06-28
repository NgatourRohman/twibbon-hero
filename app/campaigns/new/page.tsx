import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CampaignForm } from "@/components/campaign/campaign-form";
import { getCategories } from "@/lib/data";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Create campaign" };

export default async function NewCampaignPage() {
  const [user, categories] = await Promise.all([getUser(), getCategories()]);
  if (!user) redirect("/login?next=/campaigns/new");
  return (
    <div className="container-page py-9 sm:py-12">
      <div className="mb-7 max-w-2xl sm:mb-9">
        <p className="section-label">Create</p>
        <h1 className="gradient-text mt-2 font-[var(--font-display)] text-[2rem] font-extrabold tracking-[-.04em] sm:text-4xl">Launch a new campaign</h1>
        <p className="mt-3 text-muted-foreground">Add a frame, tell your story, and submit it for moderation.</p>
      </div>
      <CampaignForm categories={categories} />
    </div>
  );
}
