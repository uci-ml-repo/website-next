"use client";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import Split from "react-split";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/util/cn";
import { skipBatch, trpc } from "@/server/trpc/query/client";

export function DatasetFiles({ id, slug }: { id: number; slug: string }) {
  const { data: files, error } = trpc.file.find.list.useQuery(
    { datasetId: id, slug: decodeURIComponent(slug) },
    skipBatch,
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error fetching files</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred while fetching files."}
        </AlertDescription>
      </Alert>
    );
  }

  return files !== undefined ? (
    <Split
      direction="horizontal"
      gutterSize={6}
      snapOffset={10}
      sizes={[20, 80]}
      minSize={[150, 250]}
      className={cn(
        "animate-in fade-in flex h-[calc(100dvh-20rem)] [&_.gutter]:cursor-col-resize",
        "[&_.gutter]:flex [&_.gutter]:items-center [&_.gutter]:justify-center",
        "[&_.gutter]:after:text-muted-foreground [&_.gutter]:after:content-['⋮']",
        "[&_.gutter]:active:bg-blue/50 [&_.gutter]:transition-colors",
      )}
    >
      <div className="bg-muted overflow-auto rounded-l-sm">{JSON.stringify(files)}</div>
      <div className="bg-muted rounded-r-sm">R</div>
    </Split>
  ) : (
    <div className="w-ful text-muted-foreground flex h-20 items-center justify-center space-x-2">
      <Loader2Icon className="animate-spin" />
      <div>Loading...</div>
    </div>
  );
}
