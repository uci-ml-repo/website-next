"use client";

import type { Session } from "next-auth";
import React, { createContext, useContext, useState } from "react";

import type { DatasetSelect } from "@/db/lib/types";
import type { DatasetResponse } from "@/lib/types";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

interface DatasetContextProps {
  editable: boolean;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  dataset: DatasetSelect;
}

const DatasetContext = createContext<DatasetContextProps | undefined>(
  undefined,
);

export function DatasetProvider({
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

  const [editing, setEditing] = useState<boolean>(false);

  return (
    <DatasetContext.Provider value={{ editable, editing, setEditing, dataset }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error(
      "useDatasetEdits must be used within a DatasetEditsProvider",
    );
  }
  return context;
}
