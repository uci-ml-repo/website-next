import { DatabaseIcon } from "lucide-react";

import { DatasetMiniRow } from "@/components/dataset/preview/DatasetMiniRow";
import {
  OverviewCard,
  OverviewCardViewMore,
} from "@/components/ui/overview-card";
import { Enums } from "@/db/lib/enums";
import { ADMIN_DATASETS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function AdminDatasetsOverview() {
  const datasetsQuery = await caller.dataset.find.privilegedByQuery({
    status: [Enums.ApprovalStatus.PENDING],
  });

  return (
    <OverviewCard
      title="Users"
      icon={<DatabaseIcon className="size-5" />}
      href={ADMIN_DATASETS_ROUTE}
    >
      <div>
        {datasetsQuery.datasets.map((dataset) => (
          <DatasetMiniRow
            key={dataset.id}
            dataset={dataset}
            className="lift"
            showStatus
          />
        ))}
      </div>
      <OverviewCardViewMore
        href={ADMIN_DATASETS_ROUTE}
        text={`View ${datasetsQuery.count.toLocaleString()} pending datasets`}
      />
    </OverviewCard>
  );
}
