"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import {
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
} from "@/lib/routes";
import type { Entry } from "@/server/service/file/find";

interface DatasetFileBrowserContextProps {
  entryHistory: Entry[];
  entryForwardHistory: Entry[];
  rootPath: string;
  currentEntry: Entry;
  setCurrentEntry: (value: Entry) => void;
  back: () => void;
  forward: () => void;
}

const DatasetFileBrowserContext = createContext<
  DatasetFileBrowserContextProps | undefined
>(undefined);

export function DatasetFileBrowserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { dataset, viewPendingFiles } = useDataset();

  const rootPath = viewPendingFiles
    ? DATASET_FILES_UNZIPPED_PENDING_PATH(dataset)
    : DATASET_FILES_UNZIPPED_PATH(dataset);

  const [currentEntry, setCurrentEntryState] = useState<Entry>({
    path: rootPath,
    type: "directory",
  });

  useEffect(() => {
    setCurrentEntryState({
      path: rootPath,
      type: "directory",
    });
  }, [rootPath]);

  const [entryHistory, setFileHistory] = useState<Entry[]>([]);
  const [entryForwardHistory, setEntryForwardHistory] = useState<Entry[]>([]);

  const setCurrentEntry = (newDirectory: Entry) => {
    setFileHistory((prevHistory) => [...prevHistory, currentEntry]);
    setCurrentEntryState(newDirectory);
    setEntryForwardHistory([]);
  };

  const back = () => {
    if (entryHistory.length > 0) {
      const previousDirectory = entryHistory[entryHistory.length - 1];
      setFileHistory((prevHistory) => prevHistory.slice(0, -1));
      setEntryForwardHistory((prevForward) => [...prevForward, currentEntry]);
      setCurrentEntryState(previousDirectory);
    }
  };

  const forward = () => {
    if (entryForwardHistory.length > 0) {
      const nextDirectory = entryForwardHistory[entryForwardHistory.length - 1];
      setEntryForwardHistory((prevForward) => prevForward.slice(0, -1));
      setFileHistory((prevHistory) => [...prevHistory, currentEntry]);
      setCurrentEntryState(nextDirectory);
    }
  };

  return (
    <DatasetFileBrowserContext.Provider
      value={{
        entryHistory,
        entryForwardHistory,
        rootPath,
        currentEntry,
        setCurrentEntry,
        back,
        forward,
      }}
    >
      {children}
    </DatasetFileBrowserContext.Provider>
  );
}

export function useDatasetFileBrowser() {
  const context = useContext(DatasetFileBrowserContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
