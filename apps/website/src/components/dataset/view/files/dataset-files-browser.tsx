import type { DatasetSelect } from "@packages/db/types";
import Split from "react-split";

import { DatasetFilesBrowserProvider } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspect } from "@/components/dataset/view/files/inspect/dataset-files-browser-inspect";
import { DatasetFilesBrowserTree } from "@/components/dataset/view/files/tree/dataset-files-browser-tree";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

interface Props {
  entries: Entry[];
  dataset: DatasetSelect;
}

export function DatasetFilesBrowser({ entries, dataset }: Props) {
  return (
    <DatasetFilesBrowserProvider entries={entries}>
      <Split
        direction="horizontal"
        gutterSize={6}
        snapOffset={10}
        sizes={[20, 80]}
        minSize={[150, 250]}
        className={cn(
          "animate-in fade-in flex h-[calc(100dvh-20rem)] [&_.gutter]:cursor-col-resize",
          "[&_.gutter]:flex [&_.gutter]:items-center [&_.gutter]:justify-center",
          "[&_.gutter]:after:text-muted-foreground [&_.gutter]:active:after:text-blue-foreground [&_.gutter]:after:content-['⋮']",
          "[&_.gutter]:active:bg-blue/50 [&_.gutter]:bg-accent [&_.gutter]:transition-colors",
        )}
      >
        <div className="bg-muted/70 overflow-hidden rounded-l-sm">
          <DatasetFilesBrowserTree />
        </div>
        <div className="bg-muted/70 overflow-hidden rounded-r-sm">
          <DatasetFilesBrowserInspect dataset={dataset} />
        </div>
      </Split>
    </DatasetFilesBrowserProvider>
  );
}
