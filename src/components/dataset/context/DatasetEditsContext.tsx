"use client";

import type { Session } from "next-auth";
import { createContext, useContext } from "react";

import type { DatasetResponse } from "@/lib/types";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

interface DatasetEditsContextProps {
  editable: boolean;
}

const DatasetEditsContext = createContext<DatasetEditsContextProps | undefined>(
  undefined,
);

export function DatasetEditsProvider({
  user,
  dataset,
  children,
}: {
  user: Session["user"] | undefined;
  dataset: DatasetResponse;
  children: React.ReactNode;
}) {
  const editable =
    !!user && (isPriviliged(user.role) || dataset.userId === user.id);

  return (
    <DatasetEditsContext.Provider value={{ editable }}>
      {children}
    </DatasetEditsContext.Provider>
  );
}

export function useDatasetEdits() {
  const context = useContext(DatasetEditsContext);
  if (!context) {
    throw new Error(
      "useDatasetEdits must be used within a DatasetEditsProvider",
    );
  }
  return context;
}
