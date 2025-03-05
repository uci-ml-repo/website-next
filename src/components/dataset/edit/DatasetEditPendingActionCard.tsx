import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DatasetEditPendingActionCard({
  className,
}: {
  className?: string;
}) {
  return <Card className={cn("lift h-28", className)}>X</Card>;
}
