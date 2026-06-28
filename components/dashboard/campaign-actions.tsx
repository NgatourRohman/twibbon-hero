"use client";

import Link from "next/link";
import { Edit3, Loader2, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { deleteCampaign } from "@/app/dashboard/actions";

function DeleteButton({ withLabel = false }: { withLabel?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size={withLabel ? "default" : "icon"}
      variant={withLabel ? "destructive" : "ghost"}
      disabled={pending}
      aria-label="Delete campaign"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      {withLabel && "Delete permanently"}
    </Button>
  );
}

export function CampaignActions({ id }: { id: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div className="flex">
      <Button asChild size="icon" variant="ghost">
        <Link href={`/dashboard/campaigns/${id}/edit`} aria-label="Edit campaign">
          <Edit3 className="size-4" />
        </Link>
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Delete campaign"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Trash2 className="size-4 text-red-500" />
      </Button>
      <dialog
        ref={dialogRef}
        className="glass-panel m-auto w-[min(92vw,430px)] rounded-[28px] p-0 text-foreground shadow-[0_35px_100px_-30px_rgba(20,15,55,.65)] backdrop:bg-[#17152b]/35 backdrop:backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="p-7">
          <span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-600 shadow-clay">
            <Trash2 className="size-5" />
          </span>
          <h2 className="mt-5 font-[var(--font-display)] text-xl font-extrabold">
            Delete this campaign?
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The campaign, frame, banner, and usage records will be permanently removed.
          </p>
          <div className="mt-7 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => dialogRef.current?.close()}>
              Cancel
            </Button>
            <form action={deleteCampaign}>
              <input type="hidden" name="id" value={id} />
              <DeleteButton withLabel />
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
