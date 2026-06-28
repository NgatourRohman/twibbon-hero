"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const TwibbonEditor = dynamic(
  () => import("@/components/editor/twibbon-editor").then((m) => m.TwibbonEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="aspect-square w-full rounded-[30px]" />,
  },
);

export function TwibbonEditorLoader(props: {
  campaignId: string;
  campaignTitle: string;
  frameUrl: string;
}) {
  return <TwibbonEditor {...props} />;
}
