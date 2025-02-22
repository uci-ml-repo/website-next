import { ClockIcon, SearchIcon, TrendingUpIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DatasetDiscussionSortByProps {
  orderBy: string;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  clearSearch?: () => void;
  className?: string;
}

export function DiscussionsOrderBy({
  orderBy,
  setOrderBy,
  clearSearch,
  className,
}: DatasetDiscussionSortByProps) {
  function handleChange(value: string) {
    if (clearSearch) {
      clearSearch();
    }
    setOrderBy(value);
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="text-nowrap text-sm text-muted-foreground max-xxs:hidden">
        Sort by:
      </div>
      <Select value={orderBy} onValueChange={handleChange}>
        <SelectTrigger className="h-10 w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top">
            <TrendingUpIcon />
            <span>Top</span>
          </SelectItem>
          <SelectItem value="new">
            <ClockIcon />
            <span>New</span>
          </SelectItem>
          {orderBy === "relevance" && (
            <SelectItem value="relevance">
              <SearchIcon />
              <span>Relevance</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
