import Image from "next/image";

import { DatasetCitationButton } from "@/components/dataset/interactions/buttons/DatasetCitationButton";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetPythonImportButton } from "@/components/dataset/interactions/buttons/DatasetPythonImportButton";
import { DATASET_API_THUMBNAIL_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DatasetTitleGroup({ dataset }: { dataset: DatasetResponse }) {
  const thumbnail = DATASET_API_THUMBNAIL_ROUTE(dataset);

  return (
    <div className="flex items-center justify-between">
      <div className="w-full space-y-6">
        <div className="space-y-4">
          <h1 className="text-pretty text-3xl font-bold text-foreground">
            {dataset.title}
          </h1>
          {dataset.subtitle && (
            <p className="text-pretty text-lg text-muted-foreground">
              {dataset.subtitle}
            </p>
          )}
        </div>
        <div className="flex w-fit gap-2 max-md:w-full max-md:flex-col">
          <DatasetDownloadButton dataset={dataset} />

          {dataset.isAvailablePython && (
            <DatasetPythonImportButton dataset={dataset} />
          )}

          <DatasetCitationButton dataset={dataset} />
        </div>
      </div>
      {dataset.hasGraphics && (
        <Image
          src={thumbnail}
          width={300}
          height={120}
          alt="thumbnail"
          className={cn(
            "ml-14 h-[120px] w-[275px] min-w-64 shrink-0",
            "rounded-2xl border-2 object-cover object-center dark:brightness-90 max-lg:hidden",
          )}
          priority
        />
      )}
    </div>
  );
}
