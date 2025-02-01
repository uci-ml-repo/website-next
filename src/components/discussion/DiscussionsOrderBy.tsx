import { ArrowUpRightIcon, ClockIcon } from "lucide-react";

import type { DiscussionsOrderBy } from "@/components/discussion/Discussions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatasetDiscussionSortByProps {
  orderBy: DiscussionsOrderBy;
  setOrderBy: React.Dispatch<React.SetStateAction<DiscussionsOrderBy>>;
  className?: string;
}

export default function DiscussionsOrderBy({
  orderBy,
  setOrderBy,
  className,
}: DatasetDiscussionSortByProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="text-nowrap text-sm text-muted-foreground">Sort by:</div>
      <Select
        value={orderBy}
        onValueChange={(value) => setOrderBy(value as DiscussionsOrderBy)}
      >
        <SelectTrigger className="h-10 w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top">
            <ArrowUpRightIcon className="size-5" />
            <span>Top</span>
          </SelectItem>
          <SelectItem value="new">
            <ClockIcon className="size-5" />
            <span>New</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
