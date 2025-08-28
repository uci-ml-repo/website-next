"use client";

import { useDebouncedValue } from "@mantine/hooks";
import type { DatasetSelect } from "@packages/db/types";
import Fuse from "fuse.js";
import { parseAsInteger, useQueryState } from "nuqs";
import { parseAsString } from "nuqs/server";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { DatasetRow } from "@/components/dataset/preview/dataset-row";
import { DatasetRowSkeleton } from "@/components/dataset/preview/dataset-row-skeleton";
import { SearchInput } from "@/components/ui/input";
import { PaginationNav } from "@/components/ui/pagination-nav";

interface Props {
  datasets?: DatasetSelect[];
  searchPlaceholder?: string;
  empty: ReactNode;
}

export function ProfileDatasetSimpleSearch({ datasets, searchPlaceholder, empty }: Props) {
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [cursor, _] = useQueryState("cursor", parseAsInteger.withDefault(0));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));

  const fuse = useMemo(
    () =>
      datasets
        ? new Fuse(datasets, {
            threshold: 0.5,
            keys: [{ name: "title" }],
          })
        : undefined,
    [datasets],
  );

  const [debouncedSearch] = useDebouncedValue(search, 150);

  const searchResults = useMemo(() => {
    if (!debouncedSearch) return datasets;
    return fuse?.search(debouncedSearch).map((result) => result.item);
  }, [datasets, debouncedSearch, fuse]);

  if (!datasets) {
    return (
      <div className="divide-y">
        {Array.from({ length: limit }).map((_, index) => (
          <DatasetRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (datasets.length === 0) {
    return empty;
  }

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder={searchPlaceholder ?? "Search datasets"}
        size="md"
        value={search}
        setValue={setSearch}
        className="bg-background"
        inputProps={{ "aria-label": "Search datasets by title" }}
      />

      <div className="divide-y">
        {searchResults?.slice(cursor, cursor + limit).map((dataset) => (
          <DatasetRow key={dataset.id} dataset={dataset} />
        ))}
      </div>

      <PaginationNav
        totalCount={searchResults?.length ?? 0}
        limit={limit}
        cursor={cursor}
        onLimitChange={setLimit}
      />
    </div>
  );
}
