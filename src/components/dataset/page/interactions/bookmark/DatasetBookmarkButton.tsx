"use client";

import { BookmarkIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import SignInRequired from "@/components/auth/SignInRequired";
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
  const { data: session, status: sessionStatus } = useSession();

  const isBookmarkedQuery = trpc.datasets.bookmarks.isBookmarked.useQuery(
    {
      datasetId: dataset.id,
      userId: session?.user.id!,
    },
    {
      enabled: !!session?.user.id,
    },
  );

  const util = trpc.useUtils();

  const addBookmark = trpc.datasets.bookmarks.addBookmark.useMutation({
    onSuccess: async () => {
      await util.datasets.bookmarks.isBookmarked.invalidate({
        datasetId: dataset.id,
        userId: session?.user.id!,
      });

      toast({
        title: "Bookmark added",
        description: "View bookmarked datasets from your profile",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeBookmark = trpc.datasets.bookmarks.removeBookmark.useMutation({
    onSuccess: async () => {
      await util.datasets.bookmarks.isBookmarked.invalidate({
        datasetId: dataset.id,
        userId: session?.user.id!,
      });

      toast({
        title: "Bookmark removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookmark = async () => {
    if (!session?.user) return;

    if (isBookmarkedQuery.data) {
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
      {addBookmark.isPending ||
      removeBookmark.isPending ||
      isBookmarkedQuery.isPending ||
      sessionStatus === "loading" ? (
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
                isBookmarkedQuery.data ? "fill-uci-gold" : "fill-background",
              )}
            />
          </Button>
        </SignInRequired>
      )}
    </>
  );
}
