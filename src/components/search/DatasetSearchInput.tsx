"use client";

import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import { Card, CardContent } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetSearchInput() {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
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
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
      {inputFocused && (
        <Card className="absolute left-0 right-0 z-10 shadow-2xl">
          <CardContent className="p-0">
            <div>{inputValue}</div>
            {inputValue ? (
              isPending && <div>Loading...</div>
            ) : (
              <div>Type to search </div>
            )}
            {data &&
              (data.datasets.length === 0 ? (
                <div>No Results</div>
              ) : (
                <div>
                  {data.datasets.map((dataset) => (
                    <DatasetRow key={dataset.id} dataset={dataset} />
                  ))}
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
