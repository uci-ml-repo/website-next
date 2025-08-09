"use client";

import { Loader2Icon } from "lucide-react";
import { useState } from "react";

import { DatasetRow } from "@/components/dataset/preview/dataset-row";
import { CommandItem } from "@/components/ui/command";
import { SearchPopover } from "@/components/ui/search-popover";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetQuickSearch() {
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = trpc.dataset.find.byQuery.useQuery(
    { search: searchValue, limit: 10 },
    { ...skipBatch, placeholderData: (prev) => prev, enabled: !!searchValue },
  );

  const datasets = data?.datasets;

  const empty = (
    <div className="text-muted-foreground flex h-16 items-center px-4 text-lg">
      {searchValue ? `No datasets fround matching "${searchValue}"` : "Type to begin searching"}
    </div>
  );

  const loading = (
    <div className="flex h-16 items-center space-x-2 px-4 text-lg">
      <Loader2Icon className="animate-spin" /> <div>Searching...</div>
    </div>
  );

  return (
    <div className="blur-background">
      <SearchPopover
        value={searchValue}
        setValue={setSearchValue}
        placeholder="Search datasets"
        size="lg"
        contentClassName="rounded-xl shadow-xl [&_[data-slot"
        aria-label="Search datasets by title"
        empty={empty}
        loading={!datasets && isLoading && loading}
      >
        {searchValue && datasets && (
          <div className="max-h-[25rem] divide-y">
            {datasets.map((dataset) => (
              <CommandItem key={dataset.id} asChild>
                <DatasetRow dataset={dataset} />
              </CommandItem>
            ))}
          </div>
        )}
      </SearchPopover>
    </div>
  );
}
