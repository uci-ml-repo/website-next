"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetFilesStatusContextProps {
  filesStatus: DatasetFilesStatus;
  setFilesStatus: (status: DatasetFilesStatus) => void;
  size: number | null;
  setSize: (size: number | null) => void;
  fileCount: number | null;
  setFileCount: (count: number | null) => void;
}

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
  if (dataset.externalLink) {
    return "external";
  }

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
  const [filesStatus, setFilesStatus] = useState<DatasetFilesStatus>(
    datasetToStatus(dataset),
  );
  const [size, setSize] = useState(dataset.size);
  const [fileCount, setFileCount] = useState(dataset.fileCount);

  const { data: datasetPoll } = trpc.dataset.find.byId.useQuery(
    { datasetId: dataset.id },
    {
      refetchInterval: (data) => {
        if (!data || filesStatus === "processing") {
          return 10_000; // 10 seconds
        }
        return false;
      },
    },
  );

  useEffect(() => {
    if (datasetPoll) {
      setFilesStatus(datasetToStatus(datasetPoll));
    }
  }, [datasetPoll]);

  return (
    <DatasetFilesStatusContext.Provider
      value={{
        filesStatus,
        setFilesStatus,
        size,
        fileCount,
        setSize,
        setFileCount,
      }}
    >
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
