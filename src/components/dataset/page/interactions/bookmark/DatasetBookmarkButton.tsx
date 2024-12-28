"use client";

import { BookmarkIcon } from "lucide-react";
import type { Session } from "next-auth";
import { useState, useTransition } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import Spinner from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

interface DatasetBookmarkButtonProps {
  dataset: DatasetResponse;
  session: Session | null;
  isBookmarked: boolean;
}

export default function DatasetBookmarkButton({
  dataset,
  session,
  isBookmarked,
}: DatasetBookmarkButtonProps) {
  const [bookmarkFilled, setBookmarkFilled] = useState(isBookmarked);
  const [isPending, startTransition] = useTransition();

  const addBookmark = trpc.datasets.bookmarks.addBookmark.useMutation();
  const removeBookmark = trpc.datasets.bookmarks.removeBookmark.useMutation();

  const handleBookmark = async () => {
    startTransition(async () => {
      if (!session?.user) return;

      if (bookmarkFilled) {
        await removeBookmark.mutateAsync({
          datasetId: dataset.id,
          userId: session.user.id,
        });
      } else {
        await addBookmark.mutateAsync({
          datasetId: dataset.id,
          userId: session.user.id,
        });
      }

      toast({
        title: bookmarkFilled ? "Bookmark removed" : "Bookmark added",
        description: bookmarkFilled
          ? undefined
          : "View bookmarked datasets from your profile",
        duration: 3000,
      });

      setBookmarkFilled(!bookmarkFilled);
    });
  };

  return (
    <>
      {isPending ? (
        <Spinner className="size-5 opacity-70" />
      ) : (
        <SignInRequired
          title="Sign in to bookmark datasets"
          body="To bookmark datasets and access other features, please sign in."
          authedAction={handleBookmark}
          session={session}
        >
          <BookmarkIcon
            className={cn(
              "size-5 cursor-pointer",
              bookmarkFilled ? "fill-uci-gold" : "fill-background",
            )}
          />
        </SignInRequired>
      )}
    </>
  );
}
