"use client";

import { createContext, useContext, useState } from "react";

interface BookmarkContextProps {
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
}

const BookmarkContext = createContext<BookmarkContextProps | undefined>(
  undefined,
);

export function DatasetBookmarkProvider({
  children,
  initialBookmarked,
}: {
  children: React.ReactNode;
  initialBookmarked: boolean;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  return (
    <BookmarkContext.Provider value={{ isBookmarked, setIsBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error();
  }
  return context;
}
