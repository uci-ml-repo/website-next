"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useFileContext } from "@/components/dataset/tabs/files/FilesContext";
import { DatasetFileTree } from "@/components/dataset/tabs/files/tree/DatasetFileTree";
import { DatasetFileView } from "@/components/dataset/tabs/files/view/DatasetFileView";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { Split } from "@/components/ui/split";
import type { DatasetResponse } from "@/lib/types";

export function DatasetFilesBrowse({ dataset }: { dataset: DatasetResponse }) {
  const [splitSizes, setSplitSizes] = useState<[number, number]>([20, 80]);

  const { currentEntry } = useFileContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSplitSizes([100, 0]);
    } else {
      setSplitSizes([20, 80]);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && currentEntry.type === "file") {
      setSplitSizes([0, 100]);
    }
  }, [currentEntry, isMobile]);

  return (
    <div className="flex h-full flex-col space-y-2">
      <div className="flex justify-between md:hidden">
        <button
          onClick={() => setSplitSizes([100, 0])}
          className="flex disabled:invisible"
          disabled={splitSizes[1] < 50}
        >
          <ChevronLeftIcon />
          <span>Browse</span>
        </button>
        <button
          onClick={() => setSplitSizes([0, 100])}
          disabled={splitSizes[0] < 50}
          className="flex disabled:invisible"
        >
          <span>View File</span>
          <ChevronRightIcon />
        </button>
      </div>
      <Split
        className="h-[75dvh]"
        gutterSize={12}
        sizes={splitSizes}
        setSizes={setSplitSizes}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-l-xl border-2 border-r-0">
          <DatasetFileTree dataset={dataset} />
        </div>
        <div className="flex h-full flex-col overflow-hidden rounded-r-xl border-2 border-l-0">
          <DatasetFileView dataset={dataset} />
        </div>
      </Split>
    </div>
  );
}
