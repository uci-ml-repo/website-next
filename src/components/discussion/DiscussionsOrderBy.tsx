import { ArrowUpRightIcon, ClockIcon, SearchIcon } from "lucide-react";

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
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export default function DiscussionsOrderBy({
  orderBy,
  setOrderBy,
  setSearchValue,
  className,
}: DatasetDiscussionSortByProps) {
  function handleChange(value: string) {
    if (setSearchValue) {
      setSearchValue("");
    }
    setOrderBy(value);
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="text-nowrap text-sm text-muted-foreground">Sort by:</div>
      <Select value={orderBy} onValueChange={handleChange}>
        <SelectTrigger className="h-10 w-40">
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
          {orderBy === "relevance" && (
            <SelectItem value="relevance">
              <SearchIcon className="size-5" />
              <span>Relevance</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
