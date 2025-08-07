import type { ComponentProps } from "react";
import { useCallback } from "react";

import { DatasetSearchFilterItem } from "@/components/dataset/search/filter/type/dataset-search-filter-item";
import { DualRangeSlider } from "@/components/ui/dual-slider";
import { abbreviateDecimal } from "@/lib/util/abbreviate";

type Props = ComponentProps<typeof DatasetSearchFilterItem> &
  Pick<ComponentProps<typeof DualRangeSlider>, "max" | "min" | "onValueChange"> & {
    exponential?: number;
    sliderValues: [number, number];
  };

export function DatasetSearchFilterDualSlider({
  min,
  max,
  sliderValues,
  onValueChange,
  exponential,
  ...props
}: Props) {
  const exp = useCallback(
    (val: number) => {
      if (val === 0 || !max) {
        return 0;
      }

      if (!exponential) return val;

      const expValue = Number(
        Math.round(Math.pow(max, Math.pow(val / max, exponential))).toPrecision(2),
      );

      return expValue > 0.9 * max ? max : expValue;
    },
    [max, exponential],
  );

  const log = useCallback(
    (val: number) => {
      if (!max || max <= 1 || val <= 1 || !exponential) {
        return val;
      }

      const raw = max * Math.pow(Math.log(val) / Math.log(max), 1 / exponential);
      return Math.round(raw);
    },
    [max, exponential],
  );

  return (
    <DatasetSearchFilterItem {...props}>
      <div className="mx-2">
        <DualRangeSlider
          className="my-6"
          min={min}
          max={max}
          value={sliderValues.map(log)}
          onValueChange={(values) => {
            if (onValueChange) {
              onValueChange(values.map(exp));
            }
          }}
          step={max ? max / 100 : 1}
          label={(label) => label && abbreviateDecimal(exp(label))}
        />
      </div>
    </DatasetSearchFilterItem>
  );
}
