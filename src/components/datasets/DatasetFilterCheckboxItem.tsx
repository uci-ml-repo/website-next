import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { formatEnum } from "@/lib/utils";

interface DatasetFilterCheckboxItemProps<T> {
  toggle: (checked: boolean, value: T) => void;
  value: T;
  checked: boolean;
}

export default function DatasetFilterCheckboxItem<T>({
  toggle,
  value,
  checked,
}: DatasetFilterCheckboxItemProps<T>) {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between py-1"
      onClick={() => toggle(!checked, value)}
    >
      <div>{formatEnum(value as unknown as string[])}</div>
      <Checkbox checked={checked} />
    </div>
  );
}
