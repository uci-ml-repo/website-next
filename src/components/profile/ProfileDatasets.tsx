import type { Dataset } from "@prisma/client";
import { DatabaseIcon, SquarePenIcon } from "lucide-react";

import DatasetGroup from "@/components/dataset/summarized/DatasetGroup";
import type { DraftDatasetResponse } from "@/lib/types";

export default function ProfileDatasets({
  datasets,
  draftDatasets,
}: {
  datasets: Dataset[];
  draftDatasets: DraftDatasetResponse[];
}) {
  return (
    <div className="space-y-8">
      <DatasetGroup
        icon={<DatabaseIcon />}
        heading="Submitted Datasets"
        datasets={datasets}
      />

      <DatasetGroup
        icon={<SquarePenIcon />}
        heading="Draft Datasets"
        datasets={datasets} // TODO
      />
    </div>
  );
}
