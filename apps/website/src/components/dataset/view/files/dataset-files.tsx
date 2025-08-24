"use client";

import { AlertCircleIcon, InfoIcon, Loader2Icon } from "lucide-react";

import { DatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trpc } from "@/server/trpc/query/client";

export function DatasetFiles({ id }: { id: number }) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ datasetId: id });

  if (!dataset) throw new Error("Dataset should be prefetched");

  const { data: entries, error } = trpc.file.find.list.useQuery(
    { datasetId: id },
    { retry: false },
  );

  if (error) {
    return error.message === "NOT_FOUND" ? (
      <Alert variant="blue">
        <InfoIcon />
        <AlertTitle>Unable to browse files</AlertTitle>
        <AlertDescription>Please download the dataset to view its files</AlertDescription>
      </Alert>
    ) : (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error fetching files</AlertTitle>
        <AlertDescription>{error.message || "An unexpected error occurred"}</AlertDescription>
      </Alert>
    );
  }

  return entries !== undefined ? (
    <DatasetFilesBrowser entries={entries} dataset={dataset} />
  ) : (
    <div className="w-ful text-muted-foreground flex h-20 items-center justify-center space-x-2">
      <Loader2Icon className="animate-spin" />
      <div>Loading...</div>
    </div>
  );
}
