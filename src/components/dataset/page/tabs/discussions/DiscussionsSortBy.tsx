import { ArrowUpRightIcon, ClockIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatasetDiscussionSortByProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function DiscussionsSortBy({
  sortBy,
  setSortBy,
}: DatasetDiscussionSortByProps) {
  return (
    <div className="flex w-full items-center justify-end space-x-2">
      <div className="text-nowrap text-sm text-muted-foreground">Sort by:</div>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-32">
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
