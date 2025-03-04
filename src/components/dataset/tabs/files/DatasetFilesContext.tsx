"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import type { Entry } from "@/server/service/file/find";

interface DatasetFilesContextProps {
  fileHistory: Entry[];
  fileForwardHistory: Entry[];
  rootPath: string;
  currentEntry: Entry;
  setCurrentEntry: (value: Entry) => void;
  back: () => void;
  forward: () => void;
}

const DatasetFilesContext = createContext<DatasetFilesContextProps | undefined>(
  undefined,
);

export function DatasetFilesProvider({
  children,
  rootEntry,
}: {
  children: ReactNode;
  rootEntry: Entry;
}) {
  const [currentFile, setCurrentFileState] = useState<Entry>(rootEntry);

  const [fileHistory, setFileHistory] = useState<Entry[]>([]);
  const [fileForwardHistory, setFileForwardHistory] = useState<Entry[]>([]);

  const setCurrentFile = (newDirectory: Entry) => {
    setFileHistory((prevHistory) => [...prevHistory, currentFile]);
    setCurrentFileState(newDirectory);
    setFileForwardHistory([]);
  };

  const back = () => {
    if (fileHistory.length === 0) {
      return;
    }

    const previousDirectory = fileHistory[fileHistory.length - 1];
    setFileHistory((prevHistory) => prevHistory.slice(0, -1));
    setFileForwardHistory((prevForward) => [...prevForward, currentFile]);
    setCurrentFileState(previousDirectory);
  };

  const forward = () => {
    if (fileForwardHistory.length === 0) {
      return;
    }

    const nextDirectory = fileForwardHistory[fileForwardHistory.length - 1];
    setFileForwardHistory((prevForward) => prevForward.slice(0, -1));
    setFileHistory((prevHistory) => [...prevHistory, currentFile]);
    setCurrentFileState(nextDirectory);
  };

  return (
    <DatasetFilesContext.Provider
      value={{
        fileHistory,
        fileForwardHistory,
        rootPath: rootEntry.path,
        currentEntry: currentFile,
        setCurrentEntry: setCurrentFile,
        back,
        forward,
      }}
    >
      {children}
    </DatasetFilesContext.Provider>
  );
}

export function useDatasetFiles() {
  const context = useContext(DatasetFilesContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
