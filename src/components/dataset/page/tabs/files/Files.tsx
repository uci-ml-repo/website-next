"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import FilesBrowse from "@/components/dataset/page/tabs/files/browse/FilesBrowse";
import { useFileContext } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesView from "@/components/dataset/page/tabs/files/view/FilesView";
import Split from "@/components/ui/split";
import { useIsMobile } from "@/hooks/use-mobile";
import type { DatasetResponse } from "@/lib/types";

export default function Files({ dataset }: { dataset: DatasetResponse }) {
  const [sizes, setSizes] = useState<[number, number]>([20, 80]);

  const { currentFile } = useFileContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSizes([100, 0]);
    } else {
      setSizes([20, 80]);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && currentFile.type === "file") {
      setSizes([0, 100]);
    }
  }, [currentFile, isMobile]);

  return (
    <div className="flex h-full flex-col space-y-2">
      <div className="flex justify-between">
        <button
          onClick={() => setSizes([100, 0])}
          className="flex disabled:invisible"
          disabled={sizes[1] === 0}
        >
          <ChevronLeftIcon />
          <span>Browse</span>
        </button>
        <button
          onClick={() => setSizes([0, 100])}
          disabled={sizes[0] === 0}
          className="flex disabled:invisible"
        >
          <span>View File</span>
          <ChevronRightIcon />
        </button>
      </div>

      <Split
        className="h-[75dvh]"
        gutterSize={12}
        sizes={sizes}
        setSizes={setSizes}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-l-xl border-2 border-r-0">
          <FilesBrowse dataset={dataset} />
        </div>
        <div className="flex h-full flex-col overflow-hidden rounded-r-xl border-2 border-l-0">
          <FilesView dataset={dataset} />
        </div>
      </Split>
    </div>
  );
}
