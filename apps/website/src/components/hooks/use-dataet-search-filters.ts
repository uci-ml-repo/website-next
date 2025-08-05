import { Enums } from "@packages/db/enum";
import { parseAsArrayOf, parseAsBoolean, parseAsStringEnum, useQueryState } from "nuqs";

export enum DatasetSearchFilter {
  Python = "python",
  SubjectArea = "subjectArea",
}

export function useDatasetSearchFilters() {
  const [filterTitle, setFilterTitle] = useQueryState("title");

  const [filterSubjectArea, setFilterSubjectArea] = useQueryState(
    DatasetSearchFilter.SubjectArea,
    parseAsArrayOf(parseAsStringEnum(Object.values(Enums.DatasetSubjectArea))),
  );

  const [filterPython, setFilterPython] = useQueryState(DatasetSearchFilter.Python, parseAsBoolean);

  const clearAllFilters = () => {
    setFilterSubjectArea(null);
    setFilterPython(null);
  };

  const filters = {
    filterTitle: filterTitle?.length ? filterTitle : undefined,
    setFilterTitle,

    filterSubjectArea: filterSubjectArea?.length ? filterSubjectArea : undefined,
    setFilterSubjectArea,

    filterPython: filterPython === true ? true : undefined,
    setFilterPython,
  };

  const anyFilterActive = filters.filterPython || filters.filterSubjectArea;

  return { ...filters, clearFilters: clearAllFilters, anyFilterActive };
}
