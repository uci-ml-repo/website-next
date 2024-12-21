import Image from "next/image";

import DatasetCitationButton from "@/components/dataset/interactions/DatasetCitationButton";
import DatasetDownloadButton from "@/components/dataset/interactions/DatasetDownloadButton";
import DatasetPythonButton from "@/components/dataset/interactions/DatasetPythonButton";
import type { DatasetResponse } from "@/lib/types";
import { datasetThumbnail } from "@/lib/utils";

export default function DatasetTitleGroup({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const thumbnail = datasetThumbnail(dataset);

  return (
    <div className={"flex items-center justify-between"}>
      <div className={"w-full space-y-6"}>
        <div className={"space-y-4"}>
          <h1
            className={
              "text-pretty text-3xl font-bold text-foreground sm:text-4xl"
            }
          >
            {dataset.title}
          </h1>
          {dataset.subtitle && (
            <p className={"text-lg text-muted-foreground"}>
              {dataset.subtitle}
            </p>
          )}
        </div>
        <div className={"flex w-fit gap-2 max-sm:w-full max-sm:flex-col"}>
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
          alt={"thumbnail"}
          className={
            "ml-14 h-[120px] w-[275px] min-w-64 shrink-0 rounded-2xl object-cover object-center max-lg:hidden"
          }
          priority
        />
      )}
    </div>
  );
}
