import { useDebouncedValue } from "@mantine/hooks";
import { Enums } from "@packages/db/enum";
import { useQueryState } from "nuqs";
import {
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

import { datasetOrder, range } from "@/server/types/dataset/request";

const parser = {
  search: parseAsString,
  keywords: parseAsArrayOf(parseAsString),
  features: parseAsArrayOf(parseAsString),
  subjectAreas: parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetSubjectArea))),
  tasks: parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetTask))),
  dataTypes: parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetDataType))),
  featureTypes: parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetFeatureType))),
  instanceCount: parseAsJson(range.parse),
  featureCount: parseAsJson(range.parse),
  python: parseAsBoolean,
  order: parseAsJson(datasetOrder.parse),
};

export const serializeDatasetFilters = createSerializer(parser);

export function useDatasetSearchFilters() {
  const [search, setSearch] = useQueryState("search", parser.search);

  const [keywords, setKeywords] = useQueryState("keywords", parser.keywords);

  const [features, setFeatures] = useQueryState("features", parser.features);

  const [subjectAreas, setSubjectAreas] = useQueryState("subjectAreas", parser.subjectAreas);

  const [tasks, setTasks] = useQueryState("tasks", parser.tasks);

  const [dataTypes, setDataTypes] = useQueryState("dataTypes", parser.dataTypes);

  const [featureTypes, setFeatureTypes] = useQueryState("featureTypes", parser.featureTypes);

  const [instanceCount, setInstanceCount] = useQueryState("instanceCount", parser.instanceCount);

  const [featureCount, setFeatureCount] = useQueryState("featureCount", parser.featureCount);

  const [isAvailablePython, setIsAvailablePython] = useQueryState("python", parser.python);

  const [order, setOrder] = useQueryState("order", parser.order);

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

  const filters = {
    ...nonSearchFilters,
    search: search?.length ? search : undefined,
    order: order ?? undefined,
  };

  const setFilters = {
    setKeywords,
    setFeatures,
    setSubjectAreas,
    setTasks,
    setDataTypes,
    setFeatureTypes,
    setIsAvailablePython,
    setInstanceCount,
    setFeatureCount,
    setSearch,
    setOrder,
  };

  const clearFilters = () => Object.values(setFilters).forEach((set) => set(null));
  const anyFilterActive = Object.values(filters).some(Boolean);

  const nonSearchFilterCount = Object.values(nonSearchFilters).filter(Boolean).length;
  const filterCount = Object.values(filters).filter(Boolean).length;

  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [debouncedFeatureCount] = useDebouncedValue(featureCount, 300);
  const [debouncedInstanceCount] = useDebouncedValue(instanceCount, 300);

  const debouncedFilters = {
    search: debouncedSearch ?? undefined,
    featureCount: debouncedFeatureCount ?? undefined,
    instanceCount: debouncedInstanceCount ?? undefined,
  };

  return {
    ...filters,
    ...setFilters,
    filters,
    debouncedFilters,
    clearFilters,
    anyFilterActive,
    nonSearchFilters,
    nonSearchFilterCount,
    filterCount,
  };
}
