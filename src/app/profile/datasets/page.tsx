import { PlusIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import DatasetCardCarousel from "@/components/dataset/preview/DatasetCardCarousel";
import { Button } from "@/components/ui/button";
import { CONTRIBUTE_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const datasets = await caller.dataset.find.byUserId(session.user.id);

  const endCard = (
    <Button asChild className="lift" variant="gold">
      <Link href={CONTRIBUTE_ROUTE}>
        <PlusIcon />
        <div>Add Dataset</div>
      </Link>
    </Button>
  );

  return (
    <div className="space-y-8">
      <DatasetCardCarousel
        icon={<SquarePenIcon />}
        heading="Datasets"
        datasets={datasets}
        endCard={endCard}
      />
    </div>
  );
}
