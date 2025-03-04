import Link from "next/link";
import type { Session } from "next-auth";

import { DatasetDeleteDialog } from "@/components/dataset/tabs/settings/DatasetDeleteDialog";
import { CONTACT_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { canDeleteDataset } from "@/server/trpc/middleware/lib/roles";

export function DatasetSettingsDelete({
  dataset,
  session,
}: {
  dataset: DatasetResponse;
  session: Session;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold">Delete Dataset</h3>
      {canDeleteDataset({ user: session.user, dataset }) ? (
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            Permanently delete this dataset and all associated data.
          </p>
          <DatasetDeleteDialog dataset={dataset} session={session} />
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          To request the deletion of this dataset, please{" "}
          <Link href={CONTACT_ROUTE} className="underline">
            contact us
          </Link>
          .
        </p>
      )}
    </div>
  );
}
