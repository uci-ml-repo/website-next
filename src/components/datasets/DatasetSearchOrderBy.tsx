import {
  ArrowDownAZIcon,
  ClockIcon,
  Columns3Icon,
  Rows3Icon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const orderByOptions: Record<
  string,
  { icon: React.ReactNode; name: string; sort?: "asc" | "desc" }
> = {
  viewCount: { icon: <TrendingUpIcon />, name: "Top", sort: "desc" },
  donatedAt: { icon: <ClockIcon />, name: "New", sort: "desc" },
  instanceCount: { icon: <Rows3Icon />, name: "Instances", sort: "desc" },
  featureCount: { icon: <Columns3Icon />, name: "Features", sort: "desc" },
  title: { icon: <ArrowDownAZIcon />, name: "Title", sort: "asc" },
};

interface DatasetsSearchOrderByProps {
  value: string;
  onChange: (newValue: string) => void;
  searchActive: boolean;
}

export function DatasetSearchOrderBy({
  value,
  onChange,
  searchActive,
}: DatasetsSearchOrderByProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40" size="lg">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {searchActive && (
          <SelectItem value="relevance" size="lg">
            <SearchIcon />
            <span>Relevance</span>
          </SelectItem>
        )}
        {Object.entries(orderByOptions).map(([orderKey, { icon, name }]) => (
          <SelectItem key={orderKey} value={orderKey} size="lg">
            {icon}
            <span>{name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
