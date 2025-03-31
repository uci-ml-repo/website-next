import { DatabaseIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { ProfileDatasetsSearch } from "@/components/profile/datasets/ProfileDatasetsSearch";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
import { TabHeader } from "@/components/ui/tab-header";
import { Enums } from "@/db/lib/enums";
import { CONTRIBUTE_ROUTE } from "@/lib/routes";
import { enumToArray } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const datasetCount = await caller.dataset.find.privilegedCountByQuery({
    userId: session.user.id,
    status: enumToArray(Enums.ApprovalStatus),
  });

  if (datasetCount === 0) {
    return (
      <div className="space-y-4">
        <TabHeader icon={DatabaseIcon} title="Your Datasets" />
        <AlternativeCard>
          <div className="text-muted-foreground">You currently have no datasets.</div>
          <Button variant="gold" className="lift" asChild>
            <Link href={CONTRIBUTE_ROUTE} className="flex items-center">
              <PlusIcon />
              <span>Contribute a dataset</span>
            </Link>
          </Button>
        </AlternativeCard>
      </div>
    );
  }

  return <ProfileDatasetsSearch session={session} />;
}
