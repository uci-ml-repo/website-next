"use client";

import { createContext, useContext, useState } from "react";

import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { FileResponse } from "@/lib/types";

interface FileContextProps {
  currentDirectoryEntity: FileResponse;
  setCurrentDirectoryEntity: (value: FileResponse) => void;
}

const FileContext = createContext<FileContextProps>({
  currentDirectoryEntity: {
    path: STATIC_FILES_ROUTE,
    type: "directory",
    name: "",
  },
  setCurrentDirectoryEntity: () => {},
});

export function FileProvider({
  children,
  initialPath,
}: {
  children: React.ReactNode;
  initialPath: FileResponse;
}) {
  const [currentDirectoryEntity, setCurrentDirectoryEntity] =
    useState<FileResponse>(initialPath);

  return (
    <FileContext.Provider
      value={{
        currentDirectoryEntity,
        setCurrentDirectoryEntity,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useCurrentDirectoryEntity() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useCurrentPath must be used within a FileProvider");
  }
  return context;
}
