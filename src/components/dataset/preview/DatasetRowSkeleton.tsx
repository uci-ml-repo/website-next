import { Skeleton } from "@/components/ui/skeleton";

export default function DatasetRowSkeleton() {
  return (
    <div className="group flex space-x-2 rounded-2xl p-4">
      <Skeleton className="size-12 rounded-lg" />
      <div className="w-full space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
