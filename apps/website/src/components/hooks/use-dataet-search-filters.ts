import { useDebouncedValue } from "@mantine/hooks";
import { Enums } from "@packages/db/enum";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";

import { range } from "@/server/types/dataset/request";

export function useDatasetSearchFilters() {
  const [search, setSearch] = useQueryState("title");

  const [keywords, setKeywords] = useQueryState("keywords", parseAsArrayOf(parseAsString));

  const [features, setFeatures] = useQueryState("features", parseAsArrayOf(parseAsString));

  const [subjectAreas, setSubjectAreas] = useQueryState(
    "subjectAreas",
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetSubjectArea))),
  );

  const [tasks, setTasks] = useQueryState(
    "tasks",
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetTask))),
  );

  const [dataTypes, setDataTypes] = useQueryState(
    "dataTypes",
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetDataType))),
  );

  const [featureTypes, setFeatureTypes] = useQueryState(
    "featureTypes",
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetFeatureType))),
  );

  const [instanceCount, setInstanceCount] = useQueryState(
    "instanceCount",
    parseAsJson(range.parse),
  );

  const [featureCount, setFeatureCount] = useQueryState("featureCount", parseAsJson(range.parse));

  const [isAvailablePython, setIsAvailablePython] = useQueryState("python", parseAsBoolean);

  const nonSearchFilters = {
    keywords: keywords?.length ? keywords : undefined,
    features: features?.length ? features : undefined,
    subjectAreas: subjectAreas?.length ? subjectAreas : undefined,
    tasks: tasks?.length ? tasks : undefined,
    dataTypes: dataTypes?.length ? dataTypes : undefined,
    featureTypes: featureTypes?.length ? featureTypes : undefined,
    isAvailablePython: isAvailablePython === true ? true : undefined,
    instanceCount: instanceCount ?? undefined,
    featureCount: featureCount ?? undefined,
  };

  const setNonSearchFilters = {
    setKeywords,
    setFeatures,
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
    nonSearchFilters,
    nonSearchFilterCount,
    filterCount,
  };
}
