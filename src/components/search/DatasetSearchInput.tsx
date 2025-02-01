"use client";

import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetSearchInput() {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const debouncedSetSearchValue = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
      }, 100),
    [setSearchValue],
  );

  const { data, isPending } = trpc.dataset.find.byQuery.useQuery(
    {
      search: searchValue,
      limit: 5,
    },
    {
      enabled: searchValue.length > 0,
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSetSearchValue(newValue);
  };

  return (
    <div className="relative">
      <InputClearable
        placeholder="Search datasets"
        variantSize="xl"
        icon={SearchIcon}
        value={inputValue}
        setValue={setInputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <Card className="absolute left-0 right-0">
          <CardContent>
            {JSON.stringify(data ? data.datasets.map((d) => d.title) : [])}
            <div>{inputValue}</div>
            {isPending && <div>Loading...</div>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
