import React from "react";

import DatasetFilterCheckboxItem from "@/components/datasets/checkbox/DatasetFilterCheckboxItem";

interface DatasetFilterCheckboxProps<T extends string> {
  values: T[];
  toggle: (checked: boolean, value: T) => void;
  isToggled: (value: T) => boolean;
}

export default function DatasetFilterCheckbox<T extends string>({
  toggle,
  isToggled,
  values,
}: DatasetFilterCheckboxProps<T>) {
  return (
    <div className="space-y-1">
      {values.map((value, index) => (
        <React.Fragment key={value}>
          {index > 0 && <hr className="border-border/60" />}
          <DatasetFilterCheckboxItem
            toggle={toggle}
            value={value}
            checked={isToggled(value)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
