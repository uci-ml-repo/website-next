import { DatabaseIcon } from "lucide-react";

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
      <div className="flex h-full w-full items-center justify-around">X</div>
      <OverviewCardViewMore
        href={ADMIN_DATASETS_ROUTE}
        text={`View ${datasetsQuery.count.toLocaleString()} pending datasets`}
      />
    </OverviewCard>
  );
}
