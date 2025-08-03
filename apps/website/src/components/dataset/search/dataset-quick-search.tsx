"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

export function DatasetQuickSearch() {
  return (
    <div className="bg-background relative rounded-full">
      <Input
        className="h-12 py-4 pl-11 !text-xl placeholder:text-xl"
        placeholder="Search datasets"
      />
      <SearchIcon className="text-muted-foreground absolute top-3 left-3.5" />
    </div>
  );
}
