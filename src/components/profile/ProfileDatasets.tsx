import { PlusIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

import DatasetCardCarousel from "@/components/dataset/preview/DatasetCardCarousel";
import { Button } from "@/components/ui/button";
import type { DatasetsSelect } from "@/db/types";
import { CONTRIBUTE_PATH } from "@/lib/routes";

export default function ProfileDatasets({
  datasets,
}: {
  datasets: DatasetsSelect[];
}) {
  const endCard = (
    <Button asChild className="lift" variant="gold">
      <Link href={CONTRIBUTE_PATH}>
        <PlusIcon />
        <div>Start Draft</div>
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
