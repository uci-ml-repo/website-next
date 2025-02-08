import { useCallback, useEffect, useMemo, useState } from "react";

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
  const { filters, setFilters, debouncedSetFilters } =
    useQueryFilters<DatasetQuery>();

  const [values, setValues] = useState<number[]>([0, 0]);
  const [initialized, setInitialized] = useState(false);

  const { data } = trpc.dataset.stats.maxDataSize.useQuery();

  const log = useCallback(
    (raw: number) => {
      if (raw > 0 && data && data.maxInstanceCount > 0) {
        const ratio = raw / data.maxInstanceCount;
        const exponent = 0.7;
        return Math.round(
          Number(
            Math.round(
              Math.pow(data.maxInstanceCount, Math.pow(ratio, exponent)),
            ).toPrecision(2),
          ),
        );
      }
      return 0;
    },
    [data],
  );

  const exp = useCallback(
    (curved: number) => {
      if (!data || data.maxInstanceCount <= 0 || curved <= 0) {
        return 0;
      }
      const M = data.maxInstanceCount;
      const raw = M * Math.pow(Math.log(curved) / Math.log(M), 1 / 0.7);
      return Math.round(raw);
    },
    [data],
  );

  const maxLog = useMemo(() => log(data?.maxInstanceCount ?? 0), [data, log]);

  useEffect(() => {
    if (data && !initialized) {
      setValues([
        filters.instanceCountMin !== undefined
          ? exp(filters.instanceCountMin)
          : 0,
        filters.instanceCountMax !== undefined
          ? exp(filters.instanceCountMax)
          : data.maxInstanceCount,
      ]);
      setInitialized(true);
    }
  }, [
    data,
    filters.instanceCountMin,
    filters.instanceCountMax,
    exp,
    initialized,
  ]);

  useEffect(() => {
    if (data) {
      const minCurved = log(values[0]);
      const maxCurved = log(values[1]);

      debouncedSetFilters({
        instanceCountMin: minCurved === 0 ? undefined : minCurved,
        instanceCountMax: maxCurved === maxLog ? undefined : maxCurved,
      });
    }
  }, [data, values, log, debouncedSetFilters, maxLog]);

  return (
    <DatasetFilterItem
      label="Instance Count"
      tooltipOpen={tooltipOpen}
      tooltipContent="The number of instances (rows of data)"
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters.instanceCountMin || !!filters.instanceCountMax}
      clearFilter={() => {
        setValues([0, data?.maxInstanceCount ?? 0]);
        setFilters({
          instanceCountMin: undefined,
          instanceCountMax: undefined,
        });
      }}
    >
      {data ? (
        <div className="px-2">
          <DualRangeSlider
            label={(rawValue) => abbreviateDecimal(log(rawValue ?? 0), 2)}
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
