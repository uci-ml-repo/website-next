"use client";

import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  FileChartColumnIcon,
} from "lucide-react";
import { useState } from "react";

import DatasetMetadataCollapsible from "@/components/dataset/tabs/about/metadata/DatasetMetadataCollapsible";
import DatasetMetadataPaperPreview from "@/components/dataset/tabs/about/metadata/DatasetMetadataPaperPreview";
import { Button } from "@/components/ui/button";
import type { DatasetResponse } from "@/lib/types";

export function DatasetMetadata({ dataset }: { dataset: DatasetResponse }) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  const datasetMetadataContent: { title: string; children: React.ReactNode }[] =
    [
      {
        title: "Introductory Paper",
        children: (
          <>
            {dataset.introductoryPaper ? (
              <DatasetMetadataPaperPreview paper={dataset.introductoryPaper} />
            ) : (
              blank
            )}
          </>
        ),
      },
      // {
      //   title: "Papers Citing this Dataset",
      //   children: (
      //     <div className="space-y-4">
      //       <div className="text-sm text-muted-foreground">
      //         This list may be incomplete
      //       </div>
      //     </div>
      //   ),
      // },
    ];

  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(datasetMetadataContent.length).fill(false),
  );

  const isAnyOpen = openStates.some((state) => state);

  const changeOpenState = (index: number) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <FileChartColumnIcon className="size-6" />
          <h2 className="text-2xl font-bold">Metadata</h2>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setOpenStates([...openStates].fill(!isAnyOpen));
          }}
          className="max-xxs:hidden"
        >
          {isAnyOpen ? (
            <>
              <ChevronsDownUpIcon className="size-6" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronsUpDownIcon className="size-6" />
              Expand All
            </>
          )}
        </Button>
      </div>
      <div>
        <hr />
        {datasetMetadataContent.map((metadata, index) => (
          <div key={index}>
            <DatasetMetadataCollapsible
              title={metadata.title}
              isOpen={openStates[index]}
              onOpenChange={() => changeOpenState(index)}
            >
              {metadata.children}
            </DatasetMetadataCollapsible>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
