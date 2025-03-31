import { SearchIcon } from "lucide-react";
import React from "react";

import { InputClearable } from "@/components/ui/input-clearable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Option {
  value: string;
  label: string;
}

export interface SimpleSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  filterLabel: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: Option[];
}

export function SimpleSearch({
  searchValue,
  setSearchValue,
  handleSearchChange,
  searchPlaceholder,
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions,
}: SimpleSearchProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="w-full">
        <InputClearable
          icon={SearchIcon}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={searchValue}
          setValue={setSearchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 max-sm:w-full">
        <div className="text-nowrap text-sm text-muted-foreground max-2xs:hidden">
          {filterLabel}
        </div>
        <Select value={filterValue || "all"} onValueChange={(value) => onFilterChange(value)}>
          <SelectTrigger className="w-32" size="lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
