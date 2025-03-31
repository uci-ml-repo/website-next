import { FlagIcon } from "lucide-react";

import { OverviewCard, OverviewCardViewMore } from "@/components/ui/overview-card";
import { ADMIN_REPORTS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function AdminReportsOverview() {
  const reportCounts = await caller.report.find.countAll();
  const totalCount = reportCounts.totalCount;

  return (
    <OverviewCard title="Reports" icon={<FlagIcon className="size-5" />} href={ADMIN_REPORTS_ROUTE}>
      {totalCount > 0 ? (
        <div>X</div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-muted-foreground">No open reports</div>
        </div>
      )}
      <OverviewCardViewMore
        href={ADMIN_REPORTS_ROUTE}
        text={totalCount > 0 ? `View ${totalCount.toLocaleString()} reports` : "View all reports"}
      />
    </OverviewCard>
  );
}
