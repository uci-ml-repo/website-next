"use client";

import Image from "next/image";

import { DatasetCitationButton } from "@/components/dataset/view/header/button/dataset-citation-button";
import { DatasetDownloadButton } from "@/components/dataset/view/header/button/dataset-download-button";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

import { DatasetExternalLinkButton } from "./button/dataset-external-link-button";
import { DatasetPythonButton } from "./button/dataset-python-button";

interface Props {
  id: number;
}

export function DatasetViewHeader({ id }: Props) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ id });

  if (!dataset) throw new Error("Dataset should be prefetched");

  return (
    <div className="flex gap-x-8">
      <div className="w-full space-y-4">
        <h1 className="line-clamp-2 text-3xl font-bold">{dataset.title}</h1>
        <div className="flex gap-x-2 gap-y-3 max-sm:flex-wrap max-sm:*:w-full">
          {dataset.externalLink ? (
            <DatasetExternalLinkButton dataset={dataset} />
          ) : (
            <DatasetDownloadButton dataset={dataset} />
          )}
          <DatasetCitationButton dataset={dataset} />
          {dataset.isAvailablePython && <DatasetPythonButton dataset={dataset} />}
        </div>
      </div>
      {dataset.hasGraphics && (
        <Image
          src={ROUTES.DATASET.THUMBNAIL(dataset)}
          height={100}
          width={275}
          alt="Thumbnail"
          className="h-[6rem] w-[16rem] shrink-0 rounded-2xl object-cover object-center max-xl:hidden"
        />
      )}
    </div>
  );
}
