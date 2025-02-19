import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { formatEnum } from "@/lib/utils";

interface DatasetFilterCheckboxItemProps<T extends string> {
  toggle: (checked: boolean, value: T) => void;
  value: T;
  checked: boolean;
  ariaLabel?: string;
}

export function DatasetCheckboxFilterItem<T extends string>({
  toggle,
  value,
  checked,
  ariaLabel,
}: DatasetFilterCheckboxItemProps<T>) {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between py-1"
      onClick={() => toggle(!checked, value)}
    >
      <div>{formatEnum(value)}</div>
      <Checkbox
        checked={checked}
        aria-label={ariaLabel ?? "Filter by " + formatEnum(value)}
      />
    </div>
  );
}
