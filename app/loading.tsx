import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-16" role="status" aria-label="Loading page">
      <div className="mx-auto max-w-3xl text-center">
        <Skeleton className="mx-auto h-7 w-32 rounded-full" />
        <Skeleton className="mx-auto mt-5 h-14 w-full max-w-xl" />
        <Skeleton className="mx-auto mt-4 h-5 w-full max-w-md" />
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass-panel rounded-[26px] p-2">
            <Skeleton className="aspect-[16/10] w-full rounded-[20px]" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
