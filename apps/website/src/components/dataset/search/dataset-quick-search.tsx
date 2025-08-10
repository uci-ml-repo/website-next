"use client";

import { useDebouncedValue } from "@mantine/hooks";
import { Loader2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DatasetRow } from "@/components/dataset/preview/dataset-row";
import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { SearchPopover } from "@/components/ui/search-popover";
import { ROUTES } from "@/lib/routes";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetQuickSearch() {
  const [searchValue, setSearchValue] = useState("");

  const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);

  const { data, isLoading } = trpc.dataset.find.byQuery.useQuery(
    { search: debouncedSearchValue, limit: 10 },
    { ...skipBatch, placeholderData: (prev) => prev, enabled: !!debouncedSearchValue },
  );

  const datasets = data?.datasets;

  const empty = (
    <div className="text-muted-foreground flex h-16 items-center px-4 text-lg">
      {debouncedSearchValue && searchValue
        ? `No datasets fround matching "${searchValue}"`
        : "Type to begin searching"}
    </div>
  );

  const loading = (
    <div className="flex h-16 items-center space-x-2 px-4 text-lg">
      <Loader2Icon className="animate-spin" />
      <div>Searching...</div>
    </div>
  );

  return (
    <div className="blur-background">
      <SearchPopover
        value={searchValue}
        setValue={setSearchValue}
        placeholder="Search datasets"
        size="lg"
        contentClassName="rounded-xl shadow-xl"
        aria-label="Search datasets by title"
        empty={empty} // todo
        loading={((searchValue && !debouncedSearchValue) || isLoading) && loading}
      >
        {searchValue && !!datasets?.length && (
          <div className="max-h-[25rem] divide-y">
            {datasets.map((dataset) => (
              <CommandItem key={dataset.id} asChild>
                <DatasetRow dataset={dataset} />
              </CommandItem>
            ))}

            <div className="flex justify-center py-4">
              <Button variant="gold" asChild>
                <Link href={ROUTES.SEARCH({ search: searchValue })}>
                  <SearchIcon /> Browse All
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SearchPopover>
    </div>
  );
}
