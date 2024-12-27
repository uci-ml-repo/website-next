"use client";

import { BookmarkIcon } from "lucide-react";
import { useState, useTransition } from "react";

import Spinner from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function DatasetAuthorizedBookmarkButton({
  dataset,
  bookmarked,
}: {
  dataset: DatasetResponse;
  bookmarked: boolean;
}) {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isPending, startTransition] = useTransition();

  const addBookmark = trpc.datasets.bookmarks.addBookmark.useMutation();
  const removeBookmark = trpc.datasets.bookmarks.removeBookmark.useMutation();

  const handleBookmark = async () => {
    startTransition(async () => {
      if (isBookmarked) {
        await removeBookmark.mutateAsync(dataset.id);
      } else {
        await addBookmark.mutateAsync(dataset.id);
      }

      toast({
        title: isBookmarked ? "Bookmark removed" : "Bookmark added",
        description: isBookmarked
          ? undefined
          : "View bookmarked datasets from your profile",
        duration: 3000,
      });

      setIsBookmarked(!isBookmarked);
    });
  };

  return (
    <>
      {isPending ? (
        <Spinner className="size-5 opacity-70" />
      ) : (
        <BookmarkIcon
          className={cn(
            "size-5 cursor-pointer",
            isBookmarked ? "fill-uci-gold" : "fill-background",
          )}
          onClick={handleBookmark}
        />
      )}
    </>
  );
}
