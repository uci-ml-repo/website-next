"use client";

import { Enums, enumToArray } from "@packages/db/enum";
import type { ComponentProps } from "react";

import { DatasetSearchFilterAccordionItem } from "@/components/dataset/search/filter/dataset-search-filter-accordion-item";
import { useDatasetSearchFilters } from "@/components/hooks/use-dataet-search-filters";
import { CheckboxLabeled } from "@/components/ui/checkbox";
import { formatEnum } from "@/server/types/util/enum";

export function DatasetSearchFilterTask(
  props: ComponentProps<typeof DatasetSearchFilterAccordionItem>,
) {
  const { tasks, setTasks } = useDatasetSearchFilters();

  const addTask = (task: Enums.DatasetTask) => {
    setTasks((prev) => [...(prev ?? []), task]);
  };
  const removeTask = (task: Enums.DatasetTask) => {
    setTasks((prev) => prev?.filter((area) => area !== task) ?? []);
  };

  return (
    <DatasetSearchFilterAccordionItem
      {...props}
      badge={tasks?.length}
      clearFilter={() => setTasks(null)}
    >
      {enumToArray(Enums.DatasetTask).map((task) => {
        const checked = !!tasks?.includes(task);
        const enumString = formatEnum(task);

        return (
          <CheckboxLabeled
            key={task}
            className="py-1.5 first:pt-0 last:pb-0"
            checked={checked}
            onCheckedChange={(checked) => (checked ? addTask(task) : removeTask(task))}
            role="button"
            aria-label={`${checked ? "Disable" : "Enable"} ${enumString} task filter`}
          >
            {enumString}
          </CheckboxLabeled>
        );
      })}
    </DatasetSearchFilterAccordionItem>
  );
}
