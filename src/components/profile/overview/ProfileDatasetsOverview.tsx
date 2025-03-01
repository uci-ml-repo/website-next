import { DatabaseIcon, PlusIcon } from "lucide-react";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { DatasetMiniRow } from "@/components/dataset/preview/DatasetMiniRow";
import {
  OverviewCard,
  OverviewCardAlternativeButton,
  OverviewCardViewMore,
} from "@/components/ui/overview-card";
import { Enums } from "@/db/lib/enums";
import { CONTRIBUTE_ROUTE, PROFILE_DATASETS_ROUTE } from "@/lib/routes";
import { enumToArray } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export async function ProfileDatasetsOverview() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const datasetsQuery = await caller.dataset.find.privilegedByQuery({
    userId: session.user.id,
    order: { donatedAt: "desc" },
    status: enumToArray(Enums.ApprovalStatus),
    limit: 3,
  });

  const datasetCount = datasetsQuery.count;

  return (
    <OverviewCard
      title="Datasets"
      icon={<DatabaseIcon className="size-5" />}
      href={PROFILE_DATASETS_ROUTE}
    >
      {datasetCount > 0 ? (
        <>
          <div>
            {datasetsQuery.datasets.map((dataset) => (
              <DatasetMiniRow
                key={dataset.id}
                dataset={dataset}
                className="lift"
              />
            ))}
          </div>

          <OverviewCardViewMore
            href={PROFILE_DATASETS_ROUTE}
            text={
              datasetCount > 3
                ? `View all ${datasetCount} datasets`
                : "View all datasets"
            }
          />
        </>
      ) : (
        <OverviewCardAlternativeButton
          href={CONTRIBUTE_ROUTE}
          description="You currently have no datasets"
          buttonText="Contribute dataset"
          buttonIcon={<PlusIcon />}
        />
      )}
    </OverviewCard>
  );
}
