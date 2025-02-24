import { useCallback, useEffect, useMemo, useState } from "react";

import { DatasetFilterItem } from "@/components/datasets/DatasetFilterItem";
import { useQueryFilters } from "@/components/hooks/use-query-filters";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Spinner } from "@/components/ui/spinner";
import { abbreviateDecimal } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

interface DatasetFilterDualSliderProps {
  label: string;
  tooltipContent: string;
  filterMin: number | undefined;
  filterMinKey: keyof DatasetQuery;
  filterMax: number | undefined;
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
  filterMin,
  filterMinKey,
  filterMax,
  filterMaxKey,
  maxRawValue,
  step,
  exponent = 0.7,
  tooltipOpen,
  dropdownOpen,
  onDropdownOpenChange,
}: DatasetFilterDualSliderProps) {
  const { setFilters } = useQueryFilters<DatasetQuery>();

  const [values, setValues] = useState<number[]>([0, 0]);
  const [initialized, setInitialized] = useState<boolean>(false);

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
    if (maxRawValue) {
      setValues([
        filterMin !== undefined ? exp(filterMin) : 0,
        filterMax !== undefined ? exp(filterMax) : maxRawValue,
      ]);
    }
  }, [maxRawValue, filterMin, filterMax, exp]);

  useEffect(() => {
    if (!values || (values[0] === 0 && values[1] === 0)) return;

    if (!initialized) {
      setInitialized(true);
      return;
    }

    const minCurved = log(values[0]);
    const maxCurved = log(values[1]);

    setFilters({
      [filterMinKey]: minCurved === 0 ? undefined : minCurved,
      [filterMaxKey]: maxCurved === maxLog ? undefined : maxCurved,
      cursor: 0,
    });
  }, [
    values,
    setFilters,
    log,
    filterMinKey,
    filterMaxKey,
    maxLog,
    initialized,
  ]);

  return (
    <DatasetFilterItem
      label={label}
      tooltipOpen={tooltipOpen}
      tooltipContent={tooltipContent}
      dropdownOpen={dropdownOpen}
      onDropdownOpenChange={onDropdownOpenChange}
      active={!!filterMin || !!filterMax}
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
        />
      ) : (
        <div className="flex h-14 w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </DatasetFilterItem>
  );
}
