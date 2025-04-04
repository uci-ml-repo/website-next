"use client";

import { PencilIcon } from "lucide-react";
import Image from "next/image";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetCitationButton } from "@/components/dataset/interactions/buttons/DatasetCitationButton";
import { DatasetDownloadButton } from "@/components/dataset/interactions/buttons/DatasetDownloadButton";
import { DatasetPythonImportButton } from "@/components/dataset/interactions/buttons/DatasetPythonImportButton";
import { Button } from "@/components/ui/button";
import { DATASET_API_THUMBNAIL_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DatasetTitleGroup() {
  const { editable, dataset, editing, setEditing } = useDataset();

  const thumbnail = DATASET_API_THUMBNAIL_ROUTE(dataset);

  return (
    <div className="flex items-center justify-between">
      <div className="w-full min-w-0 space-y-6">
        <h1 className="truncate text-pretty text-3xl font-bold text-foreground">{dataset.title}</h1>
        <div className="flex w-fit gap-2 max-md:w-full max-md:flex-col">
          <DatasetDownloadButton />

          {dataset.isAvailablePython && <DatasetPythonImportButton />}

          <DatasetCitationButton />

          {editable && !editing && (
            <Button size="lg" variant="secondary" className="lift" onClick={() => setEditing(true)}>
              <PencilIcon /> Edit
            </Button>
          )}
        </div>
      </div>
      {dataset.hasGraphics && (
        <Image
          src={thumbnail}
          width={275}
          height={100}
          alt="thumbnail"
          className={cn(
            "ml-10 h-[100px] w-[275px] shrink-0",
            "rounded-2xl border-2 object-cover object-center dark:brightness-90 max-2lg:hidden",
          )}
          priority
        />
      )}
    </div>
  );
}
