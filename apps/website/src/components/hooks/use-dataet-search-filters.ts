import { parseAsBoolean, useQueryState } from "nuqs";

export enum DatasetSearchFilter {
  Python = "python",
  SubjectArea = "subjectArea",
}

export function useDatasetSearchFilters() {
  const [filterPython, setFilterPython] = useQueryState(DatasetSearchFilter.Python, parseAsBoolean);
  const [filterSubjectArea, setFilterSubjectArea] = useQueryState(DatasetSearchFilter.SubjectArea);

  return {
    filterPython,
    setFilterPython,
    filterSubjectArea,
    setFilterSubjectArea,
  };
}
