import DatasetAttributesFilter from "@/components/datasets/filters/DatasetAttributesFilter";
import DatasetDataTypeFilter from "@/components/datasets/filters/DatasetDataTypeFilter";
import DatasetFeatureCountFilter from "@/components/datasets/filters/DatasetFeatureCountFilter";
import DatasetFeatureTypesFilter from "@/components/datasets/filters/DatasetFeatureTypesFilter";
import DatasetInstanceCountFilter from "@/components/datasets/filters/DatasetInstanceCountFilter";
import DatasetKeywordsFilter from "@/components/datasets/filters/DatasetKeywordsFilter";
import DatasetPythonFilter from "@/components/datasets/filters/DatasetPythonFilter";
import DatasetSubjectAreaFilter from "@/components/datasets/filters/DatasetSubjectAreaFilter";
import DatasetTasksFilter from "@/components/datasets/filters/DatasetTasksFilter";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DatasetsFilters() {
  const FilterSeparator = () => <Separator className="mx-auto w-[95%]" />;

  return (
    <div className="mt-6 space-y-2">
      <div className="text-lg text-muted-foreground">Filters</div>
      <Card>
        <DatasetKeywordsFilter />

        <FilterSeparator />
        <DatasetAttributesFilter />

        <FilterSeparator />
        <DatasetDataTypeFilter />

        <FilterSeparator />
        <DatasetSubjectAreaFilter />

        <FilterSeparator />
        <DatasetTasksFilter />

        <FilterSeparator />
        <DatasetFeatureTypesFilter />

        <FilterSeparator />
        <DatasetFeatureCountFilter />

        <FilterSeparator />
        <DatasetInstanceCountFilter />

        <FilterSeparator />
        <DatasetPythonFilter />
      </Card>
    </div>
  );
}
