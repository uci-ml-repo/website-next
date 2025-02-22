"use client";

import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  FileChartColumnIcon,
} from "lucide-react";
import { useState } from "react";

import { DatasetMetadataAuthors } from "@/components/dataset/tabs/about/metadata/DatasetMetadataAuthors";
import { DatasetMetadataCollapsible } from "@/components/dataset/tabs/about/metadata/DatasetMetadataCollapsible";
import { DatasetMetadataDonor } from "@/components/dataset/tabs/about/metadata/DatasetMetadataDonor";
import { DatasetMetadataIntroductoryPaper } from "@/components/dataset/tabs/about/metadata/DatasetMetadataIntroductoryPaper";
import { Button } from "@/components/ui/button";
import type { DatasetResponse } from "@/lib/types";

export function DatasetMetadata({ dataset }: { dataset: DatasetResponse }) {
  const datasetMetadataContent: { title: string; children: React.ReactNode }[] =
    [
      {
        title: "Introductory Paper",
        children: (
          <DatasetMetadataIntroductoryPaper paper={dataset.introductoryPaper} />
        ),
      },
      {
        title: "Authors",
        children: <DatasetMetadataAuthors authors={dataset.authors} />,
      },
      {
        title: "Donor",
        children: <DatasetMetadataDonor donor={dataset.user} />,
      },
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
          onClick={() => {
            setOpenStates([...openStates].fill(!isAnyOpen));
          }}
          variant="ghost"
          className="max-xxs:hidden"
        >
          {isAnyOpen ? (
            <>
              <ChevronsDownUpIcon className="size-6" />
              <span>Collapse All</span>
            </>
          ) : (
            <>
              <ChevronsUpDownIcon className="size-6" />
              <span>Expand All</span>
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
