import {
  ArrowDownAZIcon,
  ClockIcon,
  Columns3Icon,
  Rows3Icon,
  TrendingUpIcon,
} from "lucide-react";

import { useQueryFilters } from "@/components/hooks/use-query-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatasetQuery } from "@/server/schema/dataset";

const orderByOptions: Record<
  string,
  { icon: React.ReactNode; name: string; sort?: "asc" | "desc" }
> = {
  viewCount: { icon: <TrendingUpIcon />, name: "Top", sort: "desc" },
  donatedAt: { icon: <ClockIcon />, name: "New", sort: "desc" },
  instanceCount: { icon: <Rows3Icon />, name: "Most Instances", sort: "desc" },
  featureCount: { icon: <Columns3Icon />, name: "Most Features", sort: "desc" },
  title: { icon: <ArrowDownAZIcon />, name: "Title", sort: "asc" },
};

export default function DatasetsSearchOrderBy({}: {}) {
  const { filters, setFilters } = useQueryFilters<DatasetQuery>();

  const defaultValue = Object.keys(filters.order || {})[0] || "viewCount";

  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">Sort By</div>
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => {
          setFilters({ order: { [value]: orderByOptions[value].sort } });
        }}
      >
        <SelectTrigger className="w-52" size="lg">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {Object.entries(orderByOptions).map(([value, { icon, name }]) => (
            <SelectItem key={value} value={value} size="lg">
              {icon}
              <span>{name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
