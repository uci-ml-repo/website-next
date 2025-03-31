import React from "react";

import { DatasetCheckboxFilterItem } from "@/components/datasets/checkbox/DatasetCheckboxFilterItem";

interface DatasetFilterCheckboxProps<T extends string> {
  values: T[];
  toggle: (checked: boolean, value: T) => void;
  isToggled: (value: T) => boolean;
}

export function DatasetCheckboxFilter<T extends string>({
  toggle,
  isToggled,
  values,
}: DatasetFilterCheckboxProps<T>) {
  return (
    <div className="space-y-1">
      {values.map((value, index) => (
        <React.Fragment key={value}>
          {index > 0 && <hr className="border-border/60" />}
          <DatasetCheckboxFilterItem toggle={toggle} value={value} checked={isToggled(value)} />
        </React.Fragment>
      ))}
    </div>
  );
}
