import type { Dataset } from "@prisma/client";
import { DatabaseIcon, PlusIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

import DatasetCardCarousel from "@/components/dataset/summarized/DatasetCardCarousel";
import { Button } from "@/components/ui/button";
import type { DraftDatasetResponse } from "@/lib/types";

export default function ProfileDatasets({
  datasets,
  draftDatasets,
}: {
  datasets: Dataset[];
  draftDatasets: DraftDatasetResponse[];
}) {
  const endCard = (
    <Button asChild className="lift" variant="gold">
      <Link href="#">
        <PlusIcon />
        <div>Start Draft</div>
      </Link>
    </Button>
  );

  return (
    <div className="space-y-8">
      <DatasetCardCarousel
        icon={<SquarePenIcon />}
        heading="Draft Datasets"
        datasets={datasets} // TODO
        endCard={endCard}
      />
      <DatasetCardCarousel
        icon={<DatabaseIcon />}
        heading="Submitted Datasets"
        datasets={datasets}
        endCard={endCard}
      />
    </div>
  );
}
