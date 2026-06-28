"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CampaignStatus } from "@/lib/types";

export async function moderateCampaign(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as CampaignStatus;
  if (!["published", "rejected", "pending"].includes(status)) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return;
  await supabase
    .from("campaigns")
    .update({
      status,
      moderated_at: new Date().toISOString(),
      moderated_by: user.id,
    })
    .eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/campaigns");
  revalidatePath("/");
}
