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
  hasPendingThumbnail: boolean;
  setHasPendingThumbnail: (status: boolean) => void;
}

const DatasetFileStatusContext = createContext<DatasetFileStatusContextProps | undefined>(
  undefined,
);

export function DatasetFileStatusProvider({
  children,
  dataset,
  initialStatus,
  initialPendingStatus,
  initialHasPendingThumbnail,
}: {
  children: React.ReactNode;
  dataset: DatasetResponse;
  initialStatus: DatasetFileStatus;
  initialPendingStatus: DatasetFileStatus;
  initialHasPendingThumbnail: boolean;
}) {
  const [fileStatus, setFileStatus] = useState<DatasetFileStatus>(initialStatus);

  const [pendingFileStatus, setPendingFileStatus] =
    useState<DatasetFileStatus>(initialPendingStatus);

  const [hasPendingThumbnail, setHasPendingThumbnail] = useState<boolean>(
    initialHasPendingThumbnail,
  );

  const { data: datasetFileStatusPoll, isFetching } = trpc.dataset.file.fileStatuses.useQuery(
    { datasetId: dataset.id },
    {
      refetchInterval: (data) => {
        if (!data || fileStatus === "unzipping" || pendingFileStatus === "unzipping") {
          return 5_000; // 5 seconds
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
  }, [datasetFileStatusPoll, isFetching]);

  return (
    <DatasetFileStatusContext.Provider
      value={{
        fileStatus,
        setFileStatus,
        pendingFileStatus,
        setPendingFileStatus,
        hasPendingThumbnail,
        setHasPendingThumbnail,
      }}
    >
      {children}
    </DatasetFileStatusContext.Provider>
  );
}

export function useDatasetFileStatus() {
  const context = useContext(DatasetFileStatusContext);
  if (!context) {
    throw new Error("useDatasetFilesStatus must be used within a DatasetFilesStatusProvider");
  }
  return context;
}
