import { PencilIcon } from "lucide-react";

import { OverviewCard, OverviewCardViewMore } from "@/components/ui/overview-card";
import { ADMIN_EDITS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function AdminEditsOverview() {
  const editsCount = await caller.edit.find.countByQuery({});

  return (
    <OverviewCard title="Edits" icon={<PencilIcon className="size-5" />} href={ADMIN_EDITS_ROUTE}>
      {editsCount > 0 ? (
        <div>X</div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-muted-foreground">No pending edits</div>
        </div>
      )}
      <OverviewCardViewMore
        href={ADMIN_EDITS_ROUTE}
        text={
          editsCount > 0 ? `View ${editsCount.toLocaleString()} pending edits` : "View all edits"
        }
      />
    </OverviewCard>
  );
}
