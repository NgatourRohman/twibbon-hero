import { createClient } from "@/lib/supabase/server";
import type { Campaign, Category } from "@/lib/types";

export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function getPublishedCampaigns({
  query,
  category,
  limit = 12,
}: {
  query?: string;
  category?: string;
  limit?: number;
} = {}): Promise<Campaign[]> {
  if (!hasSupabaseConfig) return [];
  const supabase = await createClient();
  let request = supabase
    .from("campaigns")
    .select(
      "*, categories(*), profiles!campaigns_owner_id_fkey(full_name,username,avatar_url), campaign_frames(*)",
    )
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (query) {
    const safe = query.replace(/[%_,()]/g, "");
    request = request.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
  }
  if (category) request = request.eq("categories.slug", category);

  const { data, error } = await request;
  if (error) {
    console.error("Unable to load published campaigns:", error.message);
    return [];
  }
  return (data as Campaign[] | null) ?? [];
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseConfig) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name_en");
  if (error) {
    console.error("Unable to load campaign categories:", error.message);
    return [];
  }
  return (data as Category[] | null) ?? [];
}

export async function getCampaign(slug: string): Promise<Campaign | null> {
  if (!hasSupabaseConfig) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      "*, categories(*), profiles!campaigns_owner_id_fkey(full_name,username,avatar_url), campaign_frames(*)",
    )
    .eq("slug", slug)
    .single();
  if (error) {
    console.error("Unable to load campaign:", error.message);
    return null;
  }
  return data as Campaign | null;
}
