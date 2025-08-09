import { Skeleton } from "@/components/ui/skeleton";

export function DatasetRowSkeleton() {
  return (
    <div className="p-4">
      <div className="flex space-x-2 rounded-2xl">
        <Skeleton className="size-12 rounded-lg" />
        <div className="w-full space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
