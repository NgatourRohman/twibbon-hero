export type Locale = "en" | "id";
export type CampaignStatus = "draft" | "pending" | "published" | "rejected";

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_id: string;
  slug: string;
  icon: string | null;
}

export interface CampaignFrame {
  id: string;
  campaign_id: string;
  frame_path: string;
  label: string;
  position: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  owner_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string;
  frame_path: string;
  banner_path: string | null;
  status: CampaignStatus;
  is_featured: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
  profiles?: Pick<Profile, "full_name" | "username" | "avatar_url"> | null;
  campaign_usages?: { count: number }[];
  campaign_downloads?: { count: number }[];
  campaign_frames?: CampaignFrame[];
}
