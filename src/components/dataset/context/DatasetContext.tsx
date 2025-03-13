"use client";

import type { Session } from "next-auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { Enums } from "@/db/lib/enums";
import type { DatasetResponse } from "@/lib/types";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export type DatasetField =
  | "files"
  | "title"
  | "description"
  | "subjectArea"
  | "instanceCount"
  | "featureCount"
  | "dataTypes"
  | "tasks"
  | "featureTypes"
  | "status";

type EditingState = {
  [key in DatasetField]: boolean;
};

type EditingAction =
  | { type: "start"; field: DatasetField }
  | { type: "stop"; field: DatasetField };

const initialEditingState: EditingState = {
  files: false,
  title: false,
  description: false,
  subjectArea: false,
  instanceCount: false,
  featureCount: false,
  dataTypes: false,
  tasks: false,
  featureTypes: false,
  status: false,
};

function editingReducer(
  state: EditingState,
  action: EditingAction,
): EditingState {
  switch (action.type) {
    case "start":
      return { ...state, [action.field]: true };
    case "stop":
      return { ...state, [action.field]: false };
    default:
      return state;
  }
}

interface DatasetContextProps {
  editable: boolean;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editingFields: EditingState;
  startEditingField: (field: DatasetField) => void;
  stopEditingField: (field: DatasetField) => void;
  viewPendingFiles: boolean;
  setViewPendingFiles: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [editing, setEditing] = useState<boolean>(
    dataset.status === Enums.ApprovalStatus.DRAFT,
  );
  const [editingFields, dispatch] = useReducer(
    editingReducer,
    initialEditingState,
  );
  const [viewPendingFiles, setViewPendingFiles] = useState<boolean>(false);

  const startEditingField = (field: DatasetField) => {
    dispatch({ type: "start", field });
  };

  const stopEditingField = (field: DatasetField) => {
    dispatch({ type: "stop", field });
  };

  useEffect(() => {
    if (!editing) {
      setViewPendingFiles(false);
      Object.keys(initialEditingState).forEach((field) => {
        dispatch({ type: "stop", field: field as DatasetField });
      });
    }
  }, [editing]);

  const editable =
    !!user && (isPriviliged(user.role) || dataset.userId === user.id);

  return (
    <DatasetContext.Provider
      value={{
        editable,
        editing,
        setEditing,
        editingFields,
        startEditingField,
        stopEditingField,
        viewPendingFiles,
        setViewPendingFiles,
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
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}
