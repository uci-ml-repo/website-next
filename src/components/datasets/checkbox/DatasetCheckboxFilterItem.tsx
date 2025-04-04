import React, { useCallback } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { formatEnum } from "@/lib/utils";

interface DatasetFilterCheckboxItemProps<T extends string> {
  toggle: (checked: boolean, value: T) => void;
  value: T;
  checked: boolean;
  ariaLabel?: string;
  formatText?: boolean;
}

export function DatasetCheckboxFilterItem<T extends string>({
  toggle,
  value,
  checked,
  ariaLabel,
  formatText = true,
}: DatasetFilterCheckboxItemProps<T>) {
  const text = formatText ? formatEnum(value) : value;

  const onClick = useCallback(() => {
    toggle(!checked, value);
  }, [toggle, checked, value]);

  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between space-x-1 py-1"
      onClick={onClick}
    >
      <div>{text}</div>
      <Checkbox checked={checked} aria-label={ariaLabel ?? "Filter by " + text} />
    </div>
  );
}
