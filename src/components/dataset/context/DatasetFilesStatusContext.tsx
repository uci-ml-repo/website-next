"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetFilesStatusContextProps {}

const DatasetFilesStatusContext = createContext<
  DatasetFilesStatusContextProps | undefined
>(undefined);

export type DatasetFilesStatus =
  | "external"
  | "awaiting-upload"
  | "processing"
  | "unzipped"
  | "not-unzipped";

function datasetToStatus(dataset: DatasetResponse): DatasetFilesStatus {
  if (dataset.fileCount === null) {
    return "awaiting-upload";
  }

  if (dataset.unzipped === null) {
    return "processing";
  }

  return dataset.unzipped ? "unzipped" : "not-unzipped";
}

export function DatasetFilesStatusProvider({
  children,
  dataset,
}: {
  children: React.ReactNode;
  dataset: DatasetResponse;
}) {
  const [status, setStatus] = useState<DatasetFilesStatus>(
    datasetToStatus(dataset),
  );

  const { data: datasetPoll } = trpc.dataset.find.byId.useQuery(
    { datasetId: dataset.id },
    {
      refetchInterval: (data) => {
        if (!data || status === "processing") {
          return 5000;
        }
        return false;
      },
    },
  );

  useEffect(() => {
    if (datasetPoll) {
      setStatus(datasetToStatus(datasetPoll));
    }
  }, [datasetPoll]);

  return (
    <DatasetFilesStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </DatasetFilesStatusContext.Provider>
  );
}

export function useDatasetFilesStatus() {
  const context = useContext(DatasetFilesStatusContext);
  if (!context) {
    throw new Error(
      "useDatasetFilesStatus must be used within a DatasetFilesStatusProvider",
    );
  }
  return context;
}
