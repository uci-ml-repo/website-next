"use client";

import type { Session } from "next-auth";
import React, { createContext, useContext, useState } from "react";

import type { DatasetResponse } from "@/lib/types";
import { isDraftOrPending } from "@/lib/utils/dataset";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

interface DatasetContextProps {
  editable: boolean;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editingFiles: boolean;
  setEditingFiles: React.Dispatch<React.SetStateAction<boolean>>;
  dataset: DatasetResponse;
  setDataset: React.Dispatch<React.SetStateAction<DatasetResponse>>;
  initialDataset: DatasetResponse;
}

const DatasetContext = createContext<DatasetContextProps | undefined>(
  undefined,
);

export function DatasetProvider({
  user,
  initialDataset,
  children,
}: {
  user: Session["user"] | undefined;
  initialDataset: DatasetResponse;
  children: React.ReactNode;
}) {
  const [dataset, setDataset] = useState<DatasetResponse>(initialDataset);
  const [editing, setEditing] = useState<boolean>(isDraftOrPending(dataset));
  const [editingFiles, setEditingFiles] = useState<boolean>(false);

  const editable =
    !!user && (isPriviliged(user.role) || dataset.userId === user.id);

  return (
    <DatasetContext.Provider
      value={{
        editable,
        editing,
        setEditing,
        editingFiles,
        setEditingFiles,
        dataset,
        setDataset,
        initialDataset,
      }}
    >
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
