"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useDatasetFileBrowser } from "@/components/dataset/tabs/files/browse/DatasetFileBrowserContext";
import { DatasetFileTree } from "@/components/dataset/tabs/files/browse/tree/DatasetFileTree";
import { DatasetFileView } from "@/components/dataset/tabs/files/browse/view/DatasetFileView";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { Split } from "@/components/ui/split";

export function DatasetFilesBrowse() {
  const [splitSizes, setSplitSizes] = useState<[number, number]>([20, 80]);

  const { currentEntry } = useDatasetFileBrowser();
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
        <div>
          <button
            onClick={() => setSplitSizes([100, 0])}
            className="flex disabled:hidden"
            disabled={splitSizes[1] < 50}
          >
            <ChevronLeftIcon />
            <span>Browse</span>
          </button>
        </div>
        <div>
          <button
            onClick={() => setSplitSizes([0, 100])}
            disabled={splitSizes[0] < 50}
            className="flex disabled:hidden"
          >
            <span>View File</span>
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <Split
        className="h-[75dvh]"
        gutterSize={12}
        sizes={splitSizes}
        setSizes={setSplitSizes}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-l-xl border-2 border-r-0">
          <DatasetFileTree />
        </div>
        <div className="flex h-full flex-col overflow-hidden rounded-r-xl border-2 border-l-0">
          <DatasetFileView />
        </div>
      </Split>
    </div>
  );
}
