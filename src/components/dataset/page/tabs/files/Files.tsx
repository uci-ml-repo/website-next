"use client";

import "./Files.css";

import Split from "react-split";

import FilesBrowse from "@/components/dataset/page/tabs/files/browse/FilesBrowse";
import FilesView from "@/components/dataset/page/tabs/files/view/FilesView";
import type { DatasetResponse } from "@/lib/types";

export default function Files({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div className="h-full space-y-6">
      <Split
        className="flex min-h-[400px] rounded-xl border-2"
        gutterSize={6}
        sizes={[20, 80]}
        minSize={150}
      >
        <div className="overflow-x-auto rounded-l-xl p-2">
          <FilesBrowse dataset={dataset} />
        </div>
        <div className="overflow-x-auto rounded-r-xl p-2">
          <FilesView dataset={dataset} />
        </div>
      </Split>
    </div>
  );
}
