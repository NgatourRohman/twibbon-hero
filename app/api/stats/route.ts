import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const actions = ["use", "download", "share"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (
      typeof body.campaignId !== "string" ||
      !actions.includes(body.action)
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const common = {
      campaign_id: body.campaignId,
      user_id: user?.id ?? null,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    };
    const table =
      body.action === "use"
        ? "campaign_usages"
        : body.action === "download"
          ? "campaign_downloads"
          : "campaign_shares";
    const extra =
      body.action === "download"
        ? { format: body.format === "jpeg" ? "jpg" : "png" }
        : body.action === "share"
          ? { platform: String(body.platform || "copy").slice(0, 30) }
          : {};
    const { error } = await supabase.from(table).insert({ ...common, ...extra });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
