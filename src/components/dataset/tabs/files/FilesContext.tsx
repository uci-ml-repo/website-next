"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import type { Entry } from "@/server/service/file/find";

interface FileContextProps {
  fileHistory: Entry[];
  fileForwardHistory: Entry[];
  currentEntry: Entry;
  setCurrentEntry: (value: Entry) => void;
  back: () => void;
  forward: () => void;
}

const FileContext = createContext<FileContextProps>({
  fileHistory: [],
  fileForwardHistory: [],
  currentEntry: {
    path: "",
    type: "directory",
  },
  setCurrentEntry: () => {},
  back: () => {},
  forward: () => {},
});

export function FileProvider({
  children,
  initialPath,
}: {
  children: ReactNode;
  initialPath: Entry;
}) {
  const [currentFile, setCurrentFileState] = useState<Entry>(initialPath);

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
    <FileContext.Provider
      value={{
        fileHistory,
        fileForwardHistory,
        currentEntry: currentFile,
        setCurrentEntry: setCurrentFile,
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
