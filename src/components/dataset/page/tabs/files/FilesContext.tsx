"use client";

import { createContext, useContext, useState } from "react";

import type { FileResponse } from "@/lib/types";

interface FileContextProps {
  currentPath?: FileResponse;
  setCurrentPath: (value: FileResponse | undefined) => void;
}

const FileContext = createContext<FileContextProps | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<FileResponse | undefined>();

  return (
    <FileContext.Provider
      value={{
        currentPath,
        setCurrentPath,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useCurrentPath() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error();
  }
  return context;
}
