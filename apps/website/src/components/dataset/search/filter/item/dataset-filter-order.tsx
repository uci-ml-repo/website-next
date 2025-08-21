"use client";

import {
  ArrowDownAZIcon,
  ClockIcon,
  Columns3Icon,
  Rows3Icon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatasetOrder } from "@/server/types/dataset/request";

const options: { value: DatasetOrder; label: ReactNode }[] = [
  {
    value: { viewCount: "desc" },
    label: (
      <>
        <TrendingUpIcon />
        Views
      </>
    ),
  },
  {
    value: { instanceCount: "desc" },
    label: (
      <>
        <Rows3Icon />
        Instances
      </>
    ),
  },
  {
    value: { featureCount: "descNullsLast" },
    label: (
      <>
        <Columns3Icon />
        Features
      </>
    ),
  },
  {
    value: { donatedAt: "desc" },
    label: (
      <>
        <ClockIcon />
        Newest
      </>
    ),
  },
  {
    value: { title: "asc" },
    label: (
      <>
        <ArrowDownAZIcon />
        Title
      </>
    ),
  },
];

export function DatasetFilterOrder() {
  const { order, setOrder, search } = useDatasetSearchFilters();

  const [displayValue, setDisplayValue] = useState<"relevance" | DatasetOrder>(
    order ?? { viewCount: "desc" },
  );

  function onValueChange(value: string) {
    const _value = value === JSON.stringify("relevance") ? null : JSON.parse(value);
    setOrder(_value).then(() => setDisplayValue(JSON.parse(value)));
  }

  useEffect(() => {
    if (search) {
      setOrder(null).then(() => setDisplayValue("relevance"));
    } else if (displayValue === "relevance") {
      setOrder(null).then(() => setDisplayValue({ viewCount: "desc" }));
    }
  }, [search, setOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Select value={JSON.stringify(displayValue)} onValueChange={onValueChange}>
      <SelectTrigger className="bg-background mb-0 !h-10 w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {search && (
          <SelectItem value={JSON.stringify("relevance")}>
            <SearchIcon />
            Relevance
          </SelectItem>
        )}

        {options.map(({ value, label }) => {
          const _value = JSON.stringify(value);

          return (
            <SelectItem key={_value} value={_value}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
