import Image from "next/image";

import DatasetCitationButton from "@/components/dataset/buttons/DatasetCitationButton";
import DatasetDownloadButton from "@/components/dataset/buttons/DatasetDownloadButton";
import DatasetPythonButton from "@/components/dataset/buttons/DatasetPythonButton";
import type { DatasetResponse } from "@/lib/types";
import { cn, datasetThumbnailURL } from "@/lib/utils";

export default function DatasetTitleGroup({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const thumbnail = datasetThumbnailURL(dataset);

  return (
    <div className="flex items-center justify-between">
      <div className="w-full space-y-6">
        <div className="space-y-4">
          <h1 className="text-pretty text-3xl font-bold text-foreground sm:text-4xl">
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
            <DatasetPythonButton dataset={dataset} />
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
            "rounded-2xl border-2 object-cover object-center max-lg:hidden",
          )}
          priority
        />
      )}
    </div>
  );
}
