import DatasetAttributesFilter from "@/components/datasets/filters/DatasetAttributesFilter";
import DatasetCharacteristicsFilter from "@/components/datasets/filters/DatasetCharacteristicsFilter";
import DatasetFeatureCountFilter from "@/components/datasets/filters/DatasetFeatureCountFilter";
import DatasetFeatureTypesFilter from "@/components/datasets/filters/DatasetFeatureTypesFilter";
import DatasetInstanceCountFilter from "@/components/datasets/filters/DatasetInstanceCountFilter";
import DatasetKeywordsFilter from "@/components/datasets/filters/DatasetKeywordsFilter";
import DatasetPythonFilter from "@/components/datasets/filters/DatasetPythonFilter";
import DatasetSubjectAreasFilter from "@/components/datasets/filters/DatasetSubjectAreasFilter";
import DatasetTasksFilter from "@/components/datasets/filters/DatasetTasksFilter";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DatasetsFilters() {
  return (
    <div className="mt-6 space-y-2">
      <div className="text-lg text-muted-foreground">Filters</div>
      <Card className="overflow-hidden shadow-none">
        <DatasetKeywordsFilter />
        <Separator />
        <DatasetAttributesFilter />
        <Separator />
        <DatasetCharacteristicsFilter />
        <Separator />
        <DatasetSubjectAreasFilter />
        <Separator />
        <DatasetTasksFilter />
        <Separator />
        <DatasetFeatureTypesFilter />
        <Separator />
        <DatasetFeatureCountFilter />
        <Separator />
        <DatasetInstanceCountFilter />
        <Separator />
        <DatasetPythonFilter />
      </Card>
    </div>
  );
}
