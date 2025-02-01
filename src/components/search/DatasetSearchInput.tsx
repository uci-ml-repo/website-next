"use client";

import { SearchIcon } from "lucide-react";
import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetSearchInput() {
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isPending } = trpc.dataset.find.byQuery.useQuery(
    {
      search: searchValue,
      limit: 5,
    },
    {
      enabled: searchValue.length > 0,
    },
  );

  return (
    <div className="relative">
      <InputClearable
        placeholder="Search datasets"
        variantSize="xl"
        icon={SearchIcon}
        value={searchValue}
        setValue={setSearchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Card className="absolute left-0 right-0">
        <CardContent>
          {JSON.stringify(data ? data.datasets.map((d) => d.title) : [])}
        </CardContent>
      </Card>
    </div>
  );
}
