import { Enums } from "@packages/db/enum";
import { parseAsArrayOf, parseAsBoolean, parseAsStringEnum, useQueryState } from "nuqs";

export enum DatasetSearchFilter {
  Python = "python",
  SubjectArea = "subjectArea",
  DataType = "dataType",
  FeatureType = "featureType",
  Task = "task",
}

export function useDatasetSearchFilters() {
  const [search, setSearch] = useQueryState("title");

  const [subjectAreas, setSubjectAreas] = useQueryState(
    DatasetSearchFilter.SubjectArea,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetSubjectArea))),
  );

  const [tasks, setTasks] = useQueryState(
    DatasetSearchFilter.Task,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetTask))),
  );

  const [dataTypes, setDataTypes] = useQueryState(
    DatasetSearchFilter.DataType,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetDataType))),
  );

  const [featureTypes, setFeatureTypes] = useQueryState(
    DatasetSearchFilter.FeatureType,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetFeatureType))),
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
  };

  const setNonSearchFilters = {
    setSubjectAreas,
    setTasks,
    setDataTypes,
    setFeatureTypes,
    setIsAvailablePython,
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

  return {
    ...filters,
    ...setFilters,
    clearFilters,
    anyFilterActive,
    nonSearchFilterCount,
    filterCount,
  };
}
