"use client";

import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs/server";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Entry } from "@/server/service/file/find";

type DirectoryViewType = "rows" | "grid";

interface DatasetFilesBrowserContextProps {
  dataset: { id: number; slug: string };
  entries: Entry[];
  directoryMap: Record<string, Entry[]>;
  entryMap: Record<string, Entry>;
  currentPath: string;
  currentEntry: Entry;
  setCurrentPath: (path: string) => void;
  history: string[];
  back: () => void;
  forwardHistory: string[];
  forward: () => void;
  search: string | undefined;
  setSearch: Dispatch<SetStateAction<string | undefined>>;
  directoryViewType: DirectoryViewType;
  setDirectoryViewType: Dispatch<SetStateAction<DirectoryViewType>>;
}

const DatasetFilesBrowserContext = createContext<DatasetFilesBrowserContextProps | undefined>(
  undefined,
);

export function DatasetFilesBrowserProvider({
  entries,
  dataset,
  children,
}: {
  entries: Entry[];
  dataset: { id: number; slug: string };
  children: ReactNode;
}) {
  const directoryMap = useMemo(() => {
    const map: Record<string, Entry[]> = { "/": [] };

    for (const directory of entries.filter((p) => p.kind === "directory")) {
      map[directory.key] = [];
    }

    for (const path of entries) {
      const parentPath = path.key.substring(0, path.key.lastIndexOf("/")) || "/";
      map[parentPath].push(path);
    }

    return map;
  }, [entries]);

  const entryMap = useMemo(() => {
    const map: Record<string, Entry> = {};
    for (const entry of entries) {
      map[entry.key] = entry;
    }
    return map;
  }, [entries]);

  const validPaths = useMemo(() => new Set(["/", ...entries.map((e) => e.key)]), [entries]);

  const [currentPath, setCurrentPath] = useQueryState("path", parseAsString.withDefault("/"));
  const [history, setHistory] = useState<string[]>([]);
  const [forwardHistory, setForwardHistory] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();
  const [directoryViewType, setDirectoryViewType] = useState<DirectoryViewType>("rows");

  const currentEntry = useMemo(() => {
    if (currentPath === "/") {
      return { key: "/", kind: "directory", basename: "" } as const;
    }

    return entryMap[currentPath];
  }, [entryMap, currentPath]);

  useEffect(() => {
    if (!validPaths.has(currentPath)) {
      setCurrentPath("/");
      setHistory([]);
      setForwardHistory([]);
    }
  }, [currentPath, setCurrentPath, validPaths]);

  const back = useCallback(() => {
    if (history.length) {
      setForwardHistory((prev) => [...prev, currentPath]);
      setCurrentPath(history[history.length - 1]);
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [currentPath, history, setCurrentPath]);

  const forward = useCallback(() => {
    if (forwardHistory.length) {
      setHistory((prev) => [...prev, currentPath]);
      setCurrentPath(forwardHistory[forwardHistory.length - 1]);
      setForwardHistory((prev) => prev.slice(0, -1));
    }
  }, [currentPath, forwardHistory, setCurrentPath]);

  const setCurrentPathWithHistory = useCallback(
    (path: string) => {
      setSearch(undefined);

      if (path === currentPath) return;

      setHistory((prev) => [...prev, currentPath]);
      setCurrentPath(path);
      setForwardHistory([]);
    },
    [currentPath, setCurrentPath],
  );

  return (
    <DatasetFilesBrowserContext.Provider
      value={{
        dataset,
        entries,
        directoryMap,
        entryMap,
        currentPath,
        currentEntry,
        setCurrentPath: setCurrentPathWithHistory,
        history,
        forwardHistory,
        back,
        forward,
        search,
        setSearch,
        directoryViewType,
        setDirectoryViewType,
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
