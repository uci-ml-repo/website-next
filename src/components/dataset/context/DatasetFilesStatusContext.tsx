"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { DatasetResponse } from "@/lib/types";
import type { DatasetFileStatus } from "@/server/service/dataset/file";
import { trpc } from "@/server/trpc/query/client";

interface DatasetFileStatusContextProps {
  fileStatus: DatasetFileStatus;
  setFileStatus: (status: DatasetFileStatus) => void;
  pendingFileStatus: DatasetFileStatus;
  setPendingFileStatus: (status: DatasetFileStatus) => void;
}

const DatasetFileStatusContext = createContext<
  DatasetFileStatusContextProps | undefined
>(undefined);

export function DatasetFileStatusProvider({
  children,
  dataset,
  initialStatus,
  initialPendingStatus,
}: {
  children: React.ReactNode;
  dataset: DatasetResponse;
  initialStatus: DatasetFileStatus;
  initialPendingStatus: DatasetFileStatus;
}) {
  const [fileStatus, setFileStatus] =
    useState<DatasetFileStatus>(initialStatus);

  const [pendingFileStatus, setPendingFileStatus] =
    useState<DatasetFileStatus>(initialPendingStatus);

  const { data: datasetFileStatusPoll } =
    trpc.dataset.file.zipStatuses.useQuery(
      { datasetId: dataset.id },
      {
        refetchInterval: (data) => {
          if (
            !data ||
            fileStatus === "unzipping" ||
            pendingFileStatus === "unzipping"
          ) {
            return 1_000; // 5 seconds
          }
          return false;
        },
      },
    );

  useEffect(() => {
    if (datasetFileStatusPoll) {
      setFileStatus(datasetFileStatusPoll.status);
      setPendingFileStatus(datasetFileStatusPoll.pendingStatus);
    }
  }, [datasetFileStatusPoll]);

  return (
    <DatasetFileStatusContext.Provider
      value={{
        fileStatus,
        setFileStatus,
        pendingFileStatus,
        setPendingFileStatus,
      }}
    >
      {children}
    </DatasetFileStatusContext.Provider>
  );
}

export function useDatasetFileStatus() {
  const context = useContext(DatasetFileStatusContext);
  if (!context) {
    throw new Error(
      "useDatasetFilesStatus must be used within a DatasetFilesStatusProvider",
    );
  }
  return context;
}
