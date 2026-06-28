"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteCampaign(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("frame_path,banner_path,campaign_frames(frame_path)")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();
  if (!campaign) return;

  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (!error) {
    const framePaths = [
      ...new Set([
        campaign.frame_path,
        ...(campaign.campaign_frames ?? []).map((frame) => frame.frame_path),
      ]),
    ];
    await supabase.storage.from("campaign-frames").remove(framePaths);
    if (campaign.banner_path) {
      await supabase.storage
        .from("campaign-banners")
        .remove([campaign.banner_path]);
    }
  }
  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
}
