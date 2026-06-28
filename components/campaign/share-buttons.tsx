"use client";

import { useState } from "react";
import { Check, Copy, Facebook, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButtons({
  campaignId,
  title,
}: {
  campaignId: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const getUrl = () => window.location.href;
  const track = (platform: string) =>
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, action: "share", platform }),
    }).catch(() => undefined);

  function open(platform: string, url: string) {
    track(platform);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copy() {
    await navigator.clipboard.writeText(getUrl());
    track("copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid grid-cols-4 gap-2 min-[430px]:flex min-[430px]:flex-wrap">
      <Button
        variant="secondary"
        size="icon"
        className="w-full min-[430px]:w-10"
        aria-label="Share on WhatsApp"
        onClick={() =>
          open(
            "whatsapp",
            `https://wa.me/?text=${encodeURIComponent(`${title} ${getUrl()}`)}`,
          )
        }
      >
        <MessageCircle className="size-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-full min-[430px]:w-10"
        aria-label="Share on Facebook"
        onClick={() =>
          open(
            "facebook",
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
          )
        }
      >
        <Facebook className="size-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-full min-[430px]:w-10"
        aria-label="Share on X"
        onClick={() =>
          open(
            "x",
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`,
          )
        }
      >
        <Share2 className="size-4" />
      </Button>
      <Button className="w-full min-[430px]:w-10" variant="secondary" size="icon" aria-label="Copy link" onClick={copy}>
        {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
