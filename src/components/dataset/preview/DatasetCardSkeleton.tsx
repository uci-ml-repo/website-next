import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DatasetCardSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function DatasetCardSkeleton({ children, className }: DatasetCardSkeletonProps) {
  if (children) {
    return (
      <Card className={cn("flex h-[360px] w-full items-center justify-center", className)}>
        {children}
      </Card>
    );
  }

  return (
    <Card className="h-[360px]">
      <CardHeader className={cn("p-0", className)}>
        <Skeleton className="h-[100px] w-full rounded-b-none rounded-t-2xl object-cover object-center" />
      </CardHeader>
      <CardContent className="space-y-4">
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
      <CardFooter className="h-10 justify-between border-t py-2.5">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-2/5" />
      </CardFooter>
    </Card>
  );
}
