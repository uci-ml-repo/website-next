"use client";

import FilesBrowse from "@/components/dataset/page/tabs/files/browse/FilesBrowse";
import { FileProvider } from "@/components/dataset/page/tabs/files/FilesContext";
import FilesView from "@/components/dataset/page/tabs/files/view/FilesView";
import Split from "@/components/ui/split";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesDirectory } from "@/lib/utils";

export default function Files({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div className="flex h-full flex-col space-y-6">
      <FileProvider
        initialPath={{
          path: datasetFilesDirectory(dataset),
          type: "directory",
          name: dataset.slug,
        }}
      >
        <Split
          className="max-h-[75dvh] min-h-[400px]"
          gutterSize={6}
          sizes={[20, 80]}
          minSize={150}
        >
          <div className="flex h-full flex-col rounded-l-xl border-2 border-r-0">
            <FilesBrowse dataset={dataset} />
          </div>
          <div className="flex h-full flex-col rounded-r-xl border-2 border-l-0">
            <FilesView dataset={dataset} />
          </div>
        </Split>
      </FileProvider>
    </div>
  );
}
