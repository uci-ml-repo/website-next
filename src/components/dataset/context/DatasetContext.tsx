"use client";

import type { Session } from "next-auth";
import React, { createContext, useContext, useState } from "react";

import type { DatasetSelect } from "@/db/lib/types";
import type { DatasetResponse } from "@/lib/types";
import { isDraftOrPending } from "@/lib/utils/dataset";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

interface DatasetContextProps {
  editable: boolean;
  editing: boolean;
  editingFiles: boolean;
  setEditingFiles: React.Dispatch<React.SetStateAction<boolean>>;
  edited: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editingSection: EditSection | null;
  setEditingSection: React.Dispatch<React.SetStateAction<EditSection | null>>;
  dataset: DatasetSelect;
}

const DatasetContext = createContext<DatasetContextProps | undefined>(
  undefined,
);

export type EditSection = "title" | "description" | "keywords";

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

  const [editing, setEditing] = useState<boolean>(isDraftOrPending(dataset));
  const [editingFiles, setEditingFiles] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<EditSection | null>(
    null,
  );
  const [edited, _setEdited] = useState<boolean>(false);

  return (
    <DatasetContext.Provider
      value={{
        editable,
        editing,
        setEditing,
        dataset,
        edited,
        editingFiles,
        setEditingFiles,
        editingSection,
        setEditingSection,
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
