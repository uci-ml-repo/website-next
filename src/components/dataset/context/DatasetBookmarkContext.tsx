"use client";

import { createContext, useContext, useState } from "react";

interface DatasetBookmarkContextProps {
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
}

const DatasetBookmarkContext = createContext<
  DatasetBookmarkContextProps | undefined
>(undefined);

export function DatasetBookmarkProvider({
  children,
  initialBookmarked,
}: {
  children: React.ReactNode;
  initialBookmarked: boolean;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  return (
    <DatasetBookmarkContext.Provider value={{ isBookmarked, setIsBookmarked }}>
      {children}
    </DatasetBookmarkContext.Provider>
  );
}

export function useDatasetBookmark() {
  const context = useContext(DatasetBookmarkContext);
  if (!context) {
    throw new Error(
      "useDatasetBookmark must be used within a DatasetBookmarkProvider",
    );
  }
  return context;
}
