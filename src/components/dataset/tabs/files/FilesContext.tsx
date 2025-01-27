"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import type { FileResponse } from "@/lib/types";

interface FileContextProps {
  fileHistory: FileResponse[];
  fileForwardHistory: FileResponse[];
  currentFile: FileResponse;
  setCurrentFile: (value: FileResponse) => void;
  back: () => void;
  forward: () => void;
}

const FileContext = createContext<FileContextProps>({
  fileHistory: [],
  fileForwardHistory: [],
  currentFile: {
    path: "",
    type: "directory",
  },
  setCurrentFile: () => {},
  back: () => {},
  forward: () => {},
});

export function FileProvider({
  children,
  initialPath,
}: {
  children: ReactNode;
  initialPath: FileResponse;
}) {
  const [currentFile, setCurrentFileState] =
    useState<FileResponse>(initialPath);

  const [fileHistory, setFileHistory] = useState<FileResponse[]>([]);
  const [fileForwardHistory, setFileForwardHistory] = useState<FileResponse[]>(
    [],
  );

  const setCurrentFile = (newDirectory: FileResponse) => {
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
    <FileContext.Provider
      value={{
        fileHistory,
        fileForwardHistory,
        currentFile,
        setCurrentFile,
        back,
        forward,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
