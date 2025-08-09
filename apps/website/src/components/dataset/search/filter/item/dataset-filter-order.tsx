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

  const [value, setValue] = useState<"relevance" | DatasetOrder>(order ?? { viewCount: "desc" });

  function onValueChange(value: string) {
    const _value = value === JSON.stringify("relevance") ? null : JSON.parse(value);
    setOrder(_value);
    setValue(JSON.parse(value));
  }

  useEffect(() => {
    if (search && !order) {
      setValue("relevance");
      setOrder(null);
    } else if (value === "relevance") {
      setValue({ viewCount: "desc" });
      setOrder(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <Select value={JSON.stringify(value)} onValueChange={onValueChange}>
      <SelectTrigger className="bg-background !h-10 w-40">
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
