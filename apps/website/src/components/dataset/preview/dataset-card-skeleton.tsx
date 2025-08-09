import type { ComponentProps } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/util/cn";

export function DatasetCardSkeleton({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("h-(--dataset-card-height)", className)} {...props}>
      <Skeleton className="h-24 w-full rounded-t-2xl rounded-b-none object-cover object-center" />
      <CardContent className="space-y-4 p-3">
        <div className="h-26 space-y-2">
          <CardTitle>
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-14 w-full" />
          </CardDescription>
        </div>
        <CardDescription className="flex h-18 items-end">
          <div className={cn("w-full space-y-1")}>
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-5 w-2/5" />
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="h-9 justify-between border-t pt-4.5">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-2/5" />
      </CardFooter>
    </Card>
  );
}
