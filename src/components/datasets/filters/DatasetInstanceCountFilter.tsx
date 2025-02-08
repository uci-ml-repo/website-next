import { useCallback, useEffect, useState } from "react";

import DatasetFilterItem from "@/components/datasets/DatasetFilterItem";
import type { DatasetFiltersProps } from "@/components/datasets/DatasetsFilters";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import Spinner from "@/components/ui/spinner";
import { abbreviateDecimal } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetInstanceCountFilter({
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFiltersProps) {
  const [values, setValues] = useState<number[]>();

  const { setFilters, debouncedSetFilters } = useQueryFilters<DatasetQuery>();

  const { data } = trpc.dataset.stats.maxDataSize.useQuery();

  useEffect(() => {
    if (data && !values) {
      setValues([0, data.maxInstanceCount]);
    }
  }, [data, values]);

  const getLogValue = useCallback(
    (value: number) => {
      if (value > 0 && data && data.maxInstanceCount > 0) {
        const ratio = value / data.maxInstanceCount;
        const exponent = 0.7;
        return Math.round(
          Math.pow(data.maxInstanceCount, Math.pow(ratio, exponent)),
        );
      }
      return 0;
    },
    [data],
  );

  useEffect(() => {
    if (values && data) {
      const min = getLogValue(values[0]);
      const max = getLogValue(values[1]);

      debouncedSetFilters({
        instanceCountMin: min,
        instanceCountMax: max,
      });
    }
  }, [data, values, getLogValue, debouncedSetFilters]);

  return (
    <DatasetFilterItem
      label="Instance Count"
      tooltipOpen={tooltipOpen}
      tooltipContent="The number of instances (rows of data)"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      clearFilter={() =>
        setFilters({
          instanceCountMin: undefined,
          instanceCountMax: undefined,
        })
      }
    >
      {data && values ? (
        <div className="px-2">
          <DualRangeSlider
            label={(value) => abbreviateDecimal(getLogValue(value ?? 0), 2)}
            value={values}
            onValueChange={setValues}
            step={data.maxInstanceCount / 200}
            min={0}
            max={data.maxInstanceCount}
          />
        </div>
      ) : (
        <div className="flex h-14 w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </DatasetFilterItem>
  );
}
