import { useDebouncedValue } from "@mantine/hooks";
import { Enums } from "@packages/db/enum";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsJson,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";

import { range } from "@/server/types/dataset/request";

export enum DatasetSearchFilter {
  Python = "python",
  SubjectAreas = "subjectAreas",
  Tasks = "tasks",
  DataTypes = "dataTypes",
  FeatureTypes = "featureTypes",
  InstanceCount = "instanceCount",
  FeatureCount = "featureCount",
}

export function useDatasetSearchFilters() {
  const [search, setSearch] = useQueryState("title");

  const [subjectAreas, setSubjectAreas] = useQueryState(
    DatasetSearchFilter.SubjectAreas,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetSubjectArea))),
  );

  const [tasks, setTasks] = useQueryState(
    DatasetSearchFilter.Tasks,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetTask))),
  );

  const [dataTypes, setDataTypes] = useQueryState(
    DatasetSearchFilter.DataTypes,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetDataType))),
  );

  const [featureTypes, setFeatureTypes] = useQueryState(
    DatasetSearchFilter.FeatureTypes,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetFeatureType))),
  );

  const [instanceCount, setInstanceCount] = useQueryState(
    DatasetSearchFilter.InstanceCount,
    parseAsJson(range.parse),
  );

  const [featureCount, setFeatureCount] = useQueryState(
    DatasetSearchFilter.FeatureCount,
    parseAsJson(range.parse),
  );

  const [isAvailablePython, setIsAvailablePython] = useQueryState(
    DatasetSearchFilter.Python,
    parseAsBoolean,
  );

  const nonSearchFilters = {
    subjectAreas: subjectAreas?.length ? subjectAreas : undefined,
    tasks: tasks?.length ? tasks : undefined,
    dataTypes: dataTypes?.length ? dataTypes : undefined,
    featureTypes: featureTypes?.length ? featureTypes : undefined,
    isAvailablePython: isAvailablePython === true ? true : undefined,
    instanceCount: instanceCount ?? undefined,
    featureCount: featureCount ?? undefined,
  };

  const setNonSearchFilters = {
    setSubjectAreas,
    setTasks,
    setDataTypes,
    setFeatureTypes,
    setIsAvailablePython,
    setInstanceCount,
    setFeatureCount,
  };

  const filters = {
    ...nonSearchFilters,
    search: search?.length ? search : undefined,
  };

  const setFilters = {
    ...setNonSearchFilters,
    setSearch,
  };

  const clearFilters = () => Object.values(setNonSearchFilters).forEach((set) => set(null));
  const anyFilterActive = Object.values(nonSearchFilters).some(Boolean);

  const nonSearchFilterCount = Object.values(nonSearchFilters).filter(Boolean).length;
  const filterCount = Object.values(filters).filter(Boolean).length;

  const [debouncedSearch] = useDebouncedValue(search, 100);
  const [debouncedFeatureCount] = useDebouncedValue(featureCount, 100);
  const [debouncedInstanceCount] = useDebouncedValue(instanceCount, 100);

  const debouncedFilters = {
    debouncedSearch: debouncedSearch ?? undefined,
    debouncedFeatureCount: debouncedFeatureCount ?? undefined,
    debouncedInstanceCount: debouncedInstanceCount ?? undefined,
  };

  return {
    ...filters,
    ...debouncedFilters,
    ...setFilters,
    clearFilters,
    anyFilterActive,
    nonSearchFilterCount,
    filterCount,
  };
}
