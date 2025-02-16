import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Spinner } from "@/components/ui/spinner";
import { abbreviateDecimal } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

interface DatasetFilterDualSliderProps {
  label: string;
  tooltipContent: string;
  filterMinKey: keyof DatasetQuery;
  filterMaxKey: keyof DatasetQuery;
  maxRawValue: number | undefined;
  step?: number;
  exponent?: number;
  tooltipOpen?: boolean;
  dropdownOpen?: boolean;
  onDropdownOpenChange?: () => void;
}

export function DatasetFilterDualSlider({
  label,
  tooltipContent,
  filterMinKey,
  filterMaxKey,
  maxRawValue,
  step,
  exponent = 0.7,
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFilterDualSliderProps) {
  const { filters, setFilters, debouncedSetFilters } =
    useQueryFilters<DatasetQuery>();

  const [values, setValues] = useState<number[]>([0, 0]);
  const [initialized, setInitialized] = useState(false);

  const log = useCallback(
    (raw: number) => {
      if (raw > 0 && maxRawValue && maxRawValue > 0) {
        const ratio = raw / maxRawValue;
        return Math.round(
          Number(
            Math.round(
              Math.pow(maxRawValue, Math.pow(ratio, exponent)),
            ).toPrecision(2),
          ),
        );
      }
      return 0;
    },
    [maxRawValue, exponent],
  );

  const exp = useCallback(
    (curved: number) => {
      if (!maxRawValue || maxRawValue <= 0 || curved <= 0) return 0;
      const raw =
        maxRawValue *
        Math.pow(Math.log(curved) / Math.log(maxRawValue), 1 / exponent);
      return Math.round(raw);
    },
    [maxRawValue, exponent],
  );

  const maxLog = useMemo(() => log(maxRawValue ?? 0), [maxRawValue, log]);

  useEffect(() => {
    if (maxRawValue && !initialized) {
      setValues([
        filters[filterMinKey] !== undefined
          ? exp(filters[filterMinKey] as number)
          : 0,
        filters[filterMaxKey] !== undefined
          ? exp(filters[filterMaxKey] as number)
          : maxRawValue,
      ]);
      setInitialized(true);
    }
  }, [maxRawValue, filters, filterMinKey, filterMaxKey, exp, initialized]);

  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    if (!initialized || !maxRawValue) return;

    if (
      prevFiltersRef.current[filterMinKey] !== filters[filterMinKey] &&
      filters[filterMinKey] === undefined
    ) {
      setValues((prev) => [0, prev[1]]);
    }
    if (
      prevFiltersRef.current[filterMaxKey] !== filters[filterMaxKey] &&
      filters[filterMaxKey] === undefined
    ) {
      setValues((prev) => [prev[0], maxRawValue]);
    }
    prevFiltersRef.current = filters;
  }, [filters, filterMinKey, filterMaxKey, maxRawValue, initialized]);

  useEffect(() => {
    const minCurved = log(values[0]);
    const maxCurved = log(values[1]);

    debouncedSetFilters({
      [filterMinKey]: minCurved === 0 ? undefined : minCurved,
      [filterMaxKey]: maxCurved === maxLog ? undefined : maxCurved,
    });
  }, [values, log, debouncedSetFilters, filterMinKey, filterMaxKey, maxLog]);

  return (
    <DatasetFilterItem
      label={label}
      tooltipOpen={tooltipOpen}
      tooltipContent={tooltipContent}
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filters[filterMinKey] || !!filters[filterMaxKey]}
      clearFilter={() => {
        setFilters({
          [filterMinKey]: undefined,
          [filterMaxKey]: undefined,
          cursor: 0,
        });
      }}
    >
      {maxRawValue !== undefined ? (
        <DualRangeSlider
          label={(rawValue) => abbreviateDecimal(log(rawValue ?? 0), 2)}
          value={values}
          onValueChange={setValues}
          step={step ?? maxRawValue / 200}
          min={0}
          max={maxRawValue}
          className="px-2"
        />
      ) : (
        <div className="flex h-14 w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </DatasetFilterItem>
  );
}
