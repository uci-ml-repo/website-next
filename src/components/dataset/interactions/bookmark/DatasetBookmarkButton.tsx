"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { BookmarkIcon } from "lucide-react";

import { SignInRequired } from "@/components/auth/SignInRequired";
import { useBookmark } from "@/components/dataset/context/DatasetBookmarkedContext";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

interface DatasetBookmarkButtonProps {
  dataset: DatasetResponse;
}

export function DatasetBookmarkButton({ dataset }: DatasetBookmarkButtonProps) {
  const { isBookmarked, setIsBookmarked } = useBookmark();

  const util = trpc.useUtils();

  const addBookmark = trpc.bookmark.create.addBookmark.useMutation({
    onSettled: () => {
      setIsBookmarked(true);
    },
    onSuccess: async () => {
      setIsBookmarked(true);
      util.bookmark.find.byUserQuery.invalidate();
      toast({
        title: "Bookmark added",
        description: "View bookmarked datasets from your profile",
      });

      sendGAEvent("event", "bookmark_add", {
        datasetId: dataset.id.toString(),
      });
    },
  });

  const removeBookmark = trpc.bookmark.remove.removeBookmark.useMutation({
    onSettled: () => {
      setIsBookmarked(false);
      util.bookmark.find.byUserQuery.invalidate();
    },
    onSuccess: () => {
      toast({
        title: "Bookmark removed",
      });

      sendGAEvent("event", "bookmark_remove", {
        datasetId: dataset.id.toString(),
      });
    },
  });

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark.mutateAsync({
          datasetId: dataset.id,
        });
      } else {
        await addBookmark.mutateAsync({
          datasetId: dataset.id,
        });
      }
    } catch {}
  };

  return (
    <>
      {addBookmark.isPending || removeBookmark.isPending ? (
        <Button
          size="icon"
          variant="ghost"
          disabled
          aria-label="Bookmarking dataset"
        >
          <Spinner className="!size-5 opacity-70" />
        </Button>
      ) : (
        <SignInRequired
          title="Sign in to bookmark datasets"
          body="To bookmark datasets and access other features, please sign in."
          authedAction={handleBookmark}
        >
          <Button
            size="icon"
            variant="ghost"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark dataset"}
          >
            <BookmarkIcon
              className={cn(
                "!size-5 cursor-pointer",
                isBookmarked ? "fill-uci-gold" : "",
              )}
              aria-hidden={true}
            />
          </Button>
        </SignInRequired>
      )}
    </>
  );
}
