import { Check, RotateCcw, X } from "lucide-react";
import { moderateCampaign } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function ModerationButtons({ id }: { id: string }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_40px] gap-2 sm:flex">
      <form action={moderateCampaign}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value="published" />
        <Button size="sm" className="w-full"><Check className="size-4" /> Approve</Button>
      </form>
      <form action={moderateCampaign}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value="rejected" />
        <Button size="sm" variant="destructive" className="w-full"><X className="size-4" /> Reject</Button>
      </form>
      <form action={moderateCampaign}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value="pending" />
        <Button size="icon" variant="outline" aria-label="Return to pending"><RotateCcw className="size-4" /></Button>
      </form>
    </div>
  );
}
