import { DatabaseIcon } from "lucide-react";

import { DatasetMiniRow } from "@/components/dataset/preview/DatasetMiniRow";
import { OverviewCard, OverviewCardViewMore } from "@/components/ui/overview-card";
import { Enums } from "@/db/lib/enums";
import { ADMIN_DATASETS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function AdminDatasetsOverview() {
  const datasetsQuery = await caller.dataset.find.privilegedByQuery({
    status: [Enums.ApprovalStatus.PENDING],
    limit: 4,
  });

  const datasetsCount = datasetsQuery.count;

  return (
    <OverviewCard
      title="Datasets"
      icon={<DatabaseIcon className="size-5" />}
      href={ADMIN_DATASETS_ROUTE}
    >
      {datasetsCount > 0 ? (
        <div>
          {datasetsQuery.datasets.map((dataset) => (
            <DatasetMiniRow key={dataset.id} dataset={dataset} className="lift" showStatus />
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-muted-foreground">No pending datasets</div>
        </div>
      )}
      <OverviewCardViewMore
        href={ADMIN_DATASETS_ROUTE}
        text={
          datasetsCount > 0
            ? `View ${datasetsCount.toLocaleString()} pending datasets`
            : "View all datasets"
        }
      />
    </OverviewCard>
  );
}
