"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Campaign, CampaignFrame, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

async function hasTransparency(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(bitmap.width, 1000);
  canvas.height = Math.min(bitmap.height, 1000);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return false;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 250) return true;
  }
  return false;
}

export function CampaignForm({
  categories,
  campaign,
}: {
  categories: Category[];
  campaign?: Campaign;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialFrames = campaign?.campaign_frames?.length
    ? [...campaign.campaign_frames].sort((a, b) => a.position - b.position)
    : [];
  const [existingFrames, setExistingFrames] =
    useState<CampaignFrame[]>(initialFrames);
  const [removedFrames, setRemovedFrames] = useState<CampaignFrame[]>([]);
  const [framePreviews, setFramePreviews] = useState<
    { name: string; url: string }[]
  >(
    [],
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    campaign?.banner_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-banners/${campaign.banner_path}`
      : null,
  );

  function preview(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) {
    const file = event.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  }

  function previewFrames(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setFramePreviews((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.url));
      return files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    });
  }

  function removeExistingFrame(frame: CampaignFrame) {
    setExistingFrames((current) => current.filter((item) => item.id !== frame.id));
    setRemovedFrames((current) => [...current, frame]);
  }

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
    status: "draft" | "pending",
  ) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const frames = form
      .getAll("frames")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const banner = form.get("banner") as File;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      if (!campaign && frames.length === 0) {
        throw new Error("At least one transparent PNG frame is required.");
      }
      if (existingFrames.length + frames.length === 0) {
        throw new Error("A campaign must keep at least one frame.");
      }
      if (existingFrames.length + frames.length > 10) {
        throw new Error("A campaign can contain at most 10 frames.");
      }
      for (const frame of frames) {
        if (frame.type !== "image/png") throw new Error("Frame must be a PNG file.");
        if (frame.size > 10 * 1024 * 1024) throw new Error("Frame must be under 10 MB.");
        if (!(await hasTransparency(frame))) {
          throw new Error(`${frame.name} must contain a transparent area.`);
        }
      }
      if (banner?.size && !["image/jpeg", "image/png", "image/webp"].includes(banner.type)) {
        throw new Error("Banner must be JPG, PNG, or WebP.");
      }
      if (banner?.size && banner.size > 10 * 1024 * 1024) {
        throw new Error("Banner must be under 10 MB.");
      }

      let bannerPath = campaign?.banner_path ?? null;
      const token = crypto.randomUUID();
      const uploadedFramePaths: string[] = [];
      for (const [index, frame] of frames.entries()) {
        const framePath = `${user.id}/${token}-${index + 1}-frame.png`;
        const { error } = await supabase.storage
          .from("campaign-frames")
          .upload(framePath, frame, { contentType: "image/png" });
        if (error) {
          if (uploadedFramePaths.length) {
            await supabase.storage.from("campaign-frames").remove(uploadedFramePaths);
          }
          throw error;
        }
        uploadedFramePaths.push(framePath);
      }
      if (banner?.size) {
        const ext = banner.name.split(".").pop()?.toLowerCase() || "jpg";
        bannerPath = `${user.id}/${token}-banner.${ext}`;
        const { error } = await supabase.storage
          .from("campaign-banners")
          .upload(bannerPath, banner, { contentType: banner.type });
        if (error) throw error;
      }

      const title = String(form.get("title")).trim();
      const primaryFramePath =
        existingFrames[0]?.frame_path ?? uploadedFramePaths[0];
      const record = {
        owner_id: user.id,
        category_id: String(form.get("categoryId")) || null,
        title,
        slug: campaign?.slug || `${slugify(title)}-${token.slice(0, 6)}`,
        description: String(form.get("description")).trim(),
        frame_path: primaryFramePath,
        banner_path: bannerPath,
        starts_at: String(form.get("startsAt")) || null,
        ends_at: String(form.get("endsAt")) || null,
        status,
        moderated_by: null,
        moderated_at: null,
        is_featured: false,
      };
      const campaignRequest = campaign
        ? supabase.from("campaigns").update(record).eq("id", campaign.id).select("id").single()
        : supabase.from("campaigns").insert(record).select("id").single();
      const { data: savedCampaign, error: campaignError } = await campaignRequest;
      if (campaignError || !savedCampaign) {
        if (uploadedFramePaths.length) {
          await supabase.storage.from("campaign-frames").remove(uploadedFramePaths);
        }
        if (!campaign && bannerPath) {
          await supabase.storage.from("campaign-banners").remove([bannerPath]);
        }
        throw campaignError ?? new Error("Could not save campaign.");
      }

      if (uploadedFramePaths.length) {
        const { error: framesError } = await supabase.from("campaign_frames").insert(
          uploadedFramePaths.map((framePath, index) => ({
            campaign_id: savedCampaign.id,
            frame_path: framePath,
            label: `Frame ${existingFrames.length + index + 1}`,
            position: existingFrames.length + index,
          })),
        );
        if (framesError) {
          if (!campaign) {
            await supabase.from("campaigns").delete().eq("id", savedCampaign.id);
          }
          await supabase.storage.from("campaign-frames").remove(uploadedFramePaths);
          throw framesError;
        }
      }
      if (removedFrames.length) {
        const { error: removeError } = await supabase
          .from("campaign_frames")
          .delete()
          .in("id", removedFrames.map((frame) => frame.id));
        if (removeError) throw removeError;
        await supabase.storage
          .from("campaign-frames")
          .remove(removedFrames.map((frame) => frame.frame_path));
      }
      if (
        campaign?.banner_path &&
        banner?.size &&
        campaign.banner_path !== bannerPath
      ) {
        await supabase.storage
          .from("campaign-banners")
          .remove([campaign.banner_path]);
      }
      toast.success(status === "pending" ? "Campaign submitted for review." : "Draft saved.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save campaign.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
      onSubmit={(event) => submit(event, "pending")}
    >
      <div className="glass-panel premium-border space-y-5 rounded-[24px] p-4 sm:space-y-6 sm:rounded-[28px] sm:p-8">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign title</Label>
          <Input id="title" name="title" defaultValue={campaign?.title} maxLength={120} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Story and description</Label>
          <Textarea id="description" name="description" defaultValue={campaign?.description} maxLength={5000} required />
          <p className="text-xs text-muted-foreground">Tell people why this campaign matters and how they can help.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" name="categoryId" defaultValue={campaign?.category_id ?? ""} required>
            <option value="" disabled>
              {categories.length
                ? "Select category"
                : "No categories available — check Supabase setup"}
            </option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name_en} / {category.name_id}</option>)}
          </Select>
          {!categories.length && (
            <p className="text-xs font-semibold text-red-600">
              Categories could not be loaded. Run supabase/fix-grants.sql in the
              Supabase SQL Editor, then refresh this page.
            </p>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startsAt">Start date (optional)</Label>
            <Input id="startsAt" name="startsAt" type="date" defaultValue={campaign?.starts_at?.slice(0, 10)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endsAt">End date (optional)</Label>
            <Input id="endsAt" name="endsAt" type="date" defaultValue={campaign?.ends_at?.slice(0, 10)} />
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="glass-panel rounded-[22px] p-4 sm:rounded-[26px] sm:p-5">
          <Label>Transparent frames (PNG)</Label>
          {existingFrames.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {existingFrames.map((frame) => (
                <div key={frame.id} className="relative overflow-hidden rounded-xl border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-frames/${frame.frame_path}`}
                    alt={frame.label}
                    className="aspect-square w-full object-contain"
                  />
                  <span className="block truncate px-2 py-1 text-center text-xs font-semibold">
                    {frame.label}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${frame.label}`}
                    onClick={() => removeExistingFrame(frame)}
                    className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-full bg-white/90 text-red-600 shadow"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {framePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {framePreviews.map((frame, index) => (
                <div key={frame.url} className="overflow-hidden rounded-xl border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.url} alt={frame.name} className="aspect-square w-full object-contain" />
                  <span className="block truncate px-2 py-1 text-center text-xs font-semibold">
                    Frame {existingFrames.length + index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
          <label className="mt-3 block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-violet-50/70 to-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-glow">
            <span className="grid min-h-32 place-items-center text-center text-sm text-muted-foreground">
              <span><ImagePlus className="mx-auto mb-2 size-8 text-primary" />Choose up to 10 PNG frames</span>
            </span>
            <input
              name="frames"
              type="file"
              accept="image/png"
              multiple
              className="sr-only"
              required={!campaign}
              onChange={previewFrames}
            />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">
            Each file must be transparent, square, and no larger than 10 MB.
          </p>
        </div>
        <div className="glass-panel rounded-[22px] p-4 sm:rounded-[26px] sm:p-5">
          <Label>Campaign banner</Label>
          <label className="mt-3 block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-sky-50/70 to-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-glow">
            {bannerPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerPreview} alt="Banner preview" className="aspect-video w-full object-cover" />
            ) : (
              <span className="grid aspect-video place-items-center text-center text-sm text-muted-foreground"><span><ImagePlus className="mx-auto mb-2 size-7 text-primary" />Choose banner</span></span>
            )}
            <input name="banner" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => preview(e, setBannerPreview)} />
          </label>
        </div>
        <div className="grid gap-2.5 min-[430px]:flex min-[430px]:gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={(event) => {
              const form = event.currentTarget.form;
              if (form) submit({ preventDefault() {}, currentTarget: form } as unknown as React.FormEvent<HTMLFormElement>, "draft");
            }}
          >
            <Save className="size-4" /> Save draft
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Submit
          </Button>
        </div>
      </aside>
    </form>
  );
}
