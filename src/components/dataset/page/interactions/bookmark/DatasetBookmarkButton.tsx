"use client";

import { BookmarkIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import SignInRequired from "@/components/auth/SignInRequired";
import { useBookmark } from "@/components/dataset/page/interactions/bookmark/DatasetBookmarkedContext";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

interface DatasetBookmarkButtonProps {
  dataset: DatasetResponse;
}

export default function DatasetBookmarkButton({
  dataset,
}: DatasetBookmarkButtonProps) {
  const { data: session } = useSession();
  const { isBookmarked, setIsBookmarked } = useBookmark();

  const addBookmark = trpc.bookmarks.create.addBookmark.useMutation({
    onSuccess: async () => {
      setIsBookmarked(true);
      toast({
        title: "Bookmark added",
        description: "View bookmarked datasets from your profile",
      });
    },
  });

  const removeBookmark = trpc.bookmarks.remove.removeBookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked(false);
      toast({
        title: "Bookmark removed",
      });
    },
  });

  const handleBookmark = async () => {
    if (!session?.user) return;

    if (isBookmarked) {
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
  };

  return (
    <>
      {addBookmark.isPending || removeBookmark.isPending ? (
        <Button size="icon" variant="ghost" disabled>
          <Spinner className="!size-5 opacity-70" />
        </Button>
      ) : (
        <SignInRequired
          title="Sign in to bookmark datasets"
          body="To bookmark datasets and access other features, please sign in."
          authedAction={handleBookmark}
          session={session}
        >
          <Button size="icon" variant="ghost">
            <BookmarkIcon
              className={cn(
                "!size-5 cursor-pointer",
                isBookmarked ? "fill-uci-gold" : "",
              )}
            />
          </Button>
        </SignInRequired>
      )}
    </>
  );
}
