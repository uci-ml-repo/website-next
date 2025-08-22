"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { Entry } from "@/server/service/file/find";

type PathMap = Record<string, Entry | Entry[]>;

interface DatasetFilesBrowserContextProps {
  entries: Entry[];
  entryMap: PathMap;
  currentPath: string;
  currentEntryType: "file" | "directory";
  setCurrentPath: (path: string) => void;
  history: string[];
  back: () => void;
  forwardHistory: string[];
  forward: () => void;
  searching: boolean;
  setSearching: Dispatch<SetStateAction<boolean>>;
}

const DatasetFilesBrowserContext = createContext<DatasetFilesBrowserContextProps | undefined>(
  undefined,
);

export function DatasetFilesBrowserProvider({
  entries,
  children,
}: {
  entries: Entry[];
  children: ReactNode;
}) {
  const entryMap = useMemo(() => {
    const map: PathMap = { "/": [] };

    for (const directory of entries.filter((p) => p.kind === "directory")) {
      map[directory.key] = [];
    }

    for (const path of entries) {
      const parentPath = path.key.substring(0, path.key.lastIndexOf("/")) || "/";
      (map[parentPath] as Entry[]).push(path);
    }

    return map;
  }, [entries]);

  const [currentPath, setCurrentPath] = useState("/");
  const [history, setHistory] = useState<string[]>([]);
  const [forwardHistory, setForwardHistory] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);

  const back = useCallback(() => {
    if (history.length) {
      setForwardHistory((prev) => [...prev, currentPath]);
      setCurrentPath(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [currentPath, history]);

  const forward = useCallback(() => {
    if (forwardHistory.length) {
      setHistory((prev) => [...prev, currentPath]);
      setCurrentPath(forwardHistory[forwardHistory.length - 1]);
      setForwardHistory((prev) => prev.slice(0, -1));
    }
  }, [currentPath, forwardHistory]);

  const setCurrentPathWithHistory = useCallback(
    (path: string) => {
      setHistory((prev) => [...prev, currentPath]);
      setCurrentPath(path);
      setForwardHistory([]);
    },
    [currentPath],
  );

  const currentEntryType = useMemo(
    () => (Array.isArray(entryMap[currentPath]) ? "directory" : "file"),
    [currentPath, entryMap],
  );

  return (
    <DatasetFilesBrowserContext.Provider
      value={{
        entries,
        entryMap,
        currentPath,
        currentEntryType,
        setCurrentPath: setCurrentPathWithHistory,
        history,
        forwardHistory,
        back,
        forward,
        searching,
        setSearching,
      }}
    >
      {children}
    </DatasetFilesBrowserContext.Provider>
  );
}

export function useDatasetFilesBrowser() {
  const context = useContext(DatasetFilesBrowserContext);
  if (!context) throw new Error();
  return context;
}
