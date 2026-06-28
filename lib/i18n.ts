import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export const messages = {
  en: {
    navExplore: "Explore",
    navCreate: "Create campaign",
    navDashboard: "Dashboard",
    navLogin: "Sign in",
    heroBadge: "Make every movement visible",
    heroTitle: "Turn your support into a story worth sharing.",
    heroBody:
      "Create a campaign, add your photo, and inspire your community with a frame that speaks.",
    heroCta: "Explore campaigns",
    heroCreate: "Start a campaign",
    searchPlaceholder: "Search causes, events, or communities...",
    featured: "Featured campaigns",
    featuredBody: "Discover movements people are rallying around right now.",
    viewAll: "View all",
    participants: "supporters",
    howTitle: "Create your moment in three steps",
    howOne: "Choose a campaign",
    howTwo: "Personalize your photo",
    howThree: "Download & share",
    ctaTitle: "Have an idea that deserves attention?",
    ctaBody: "Launch your campaign in minutes and give people a simple way to join.",
    footer: "Made for communities that move the world.",
    loading: "Loading...",
    empty: "No campaigns found.",
  },
  id: {
    navExplore: "Jelajahi",
    navCreate: "Buat kampanye",
    navDashboard: "Dasbor",
    navLogin: "Masuk",
    heroBadge: "Buat setiap gerakan terlihat",
    heroTitle: "Ubah dukunganmu menjadi cerita yang layak dibagikan.",
    heroBody:
      "Buat kampanye, tambahkan fotomu, dan inspirasi komunitas dengan bingkai yang berbicara.",
    heroCta: "Jelajahi kampanye",
    heroCreate: "Mulai kampanye",
    searchPlaceholder: "Cari gerakan, acara, atau komunitas...",
    featured: "Kampanye pilihan",
    featuredBody: "Temukan gerakan yang sedang didukung banyak orang.",
    viewAll: "Lihat semua",
    participants: "pendukung",
    howTitle: "Buat momenmu dalam tiga langkah",
    howOne: "Pilih kampanye",
    howTwo: "Personalisasi foto",
    howThree: "Unduh & bagikan",
    ctaTitle: "Punya ide yang layak mendapat perhatian?",
    ctaBody: "Luncurkan kampanye dalam hitungan menit dan mudahkan orang untuk bergabung.",
    footer: "Dibuat untuk komunitas yang menggerakkan dunia.",
    loading: "Memuat...",
    empty: "Kampanye tidak ditemukan.",
  },
} as const;

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("locale")?.value;
  return value === "id" ? "id" : "en";
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: messages[locale] };
}
