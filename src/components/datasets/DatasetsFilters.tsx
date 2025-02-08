import { CircleHelpIcon } from "lucide-react";

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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

export default function DatasetsFilters() {
  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between space-x-2 text-lg text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>Filters</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button>
                <CircleHelpIcon className="size-5" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">X </HoverCardContent>
          </HoverCard>
        </div>
        <div>X</div>
      </div>
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
