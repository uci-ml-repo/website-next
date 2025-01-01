"use client";

import "./Files.css";

import Split from "react-split";

import FilesBrowse from "@/components/dataset/page/tabs/files/browse/FilesBrowse";
import { FileProvider } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesView from "@/components/dataset/page/tabs/files/view/FilesView";
import type { DatasetResponse } from "@/lib/types";

export default function Files({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div className="flex h-full flex-col space-y-6">
      <FileProvider>
        <Split
          className="flex max-h-[80dvh] min-h-[400px] flex-1 rounded-xl border-2"
          gutterSize={6}
          sizes={[20, 80]}
          minSize={150}
        >
          <div className="flex flex-col overflow-auto rounded-l-xl">
            <FilesBrowse dataset={dataset} />
          </div>
          <div className="flex flex-col overflow-auto rounded-r-xl">
            <FilesView dataset={dataset} />
          </div>
        </Split>
      </FileProvider>
    </div>
  );
}
