"use client";

import type { Session } from "@packages/auth/auth";
import type { DatasetSelect } from "@packages/db/types";
import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/ui/require-auth";
import { cn } from "@/lib/util/cn";
import { trpc } from "@/server/trpc/query/client";

interface Props {
  dataset: DatasetSelect;
  session: Session | null;
}

export function DatasetBookmarkButton({ dataset, session }: Props) {
  const { data: initialBookmarked } = trpc.bookmark.find.isDatasetBookmarked.useQuery(
    { datasetId: dataset.id, userId: session?.user.id ?? "" },
    { enabled: !!session?.user },
  );

  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const removeBookmark = trpc.bookmark.delete.removeBookmark.useMutation({
    onMutate: () => setBookmarked(false),
    onSuccess: () => {
      toast.success("Removed bookmark");
    },
    onError: () => {
      setBookmarked(true);
      toast.error("Failed to remove bookmark. Please try again.");
    },
  });
  const addBookmark = trpc.bookmark.insert.addBookmark.useMutation({
    onMutate: () => setBookmarked(true),
    onSuccess: () => toast.success("Added bookmark"),
    onError: () => {
      setBookmarked(false);
      toast.error("Failed to add bookmark. Please try again.");
    },
  });

  async function toggleBookmark() {
    if (bookmarked) {
      removeBookmark.mutate({ datasetId: dataset.id, userId: session?.user.id ?? "" });
    } else {
      addBookmark.mutate({ datasetId: dataset.id, userId: session?.user.id ?? "" });
    }
  }

  return (
    <RequireAuth
      dialog={{
        title: "Sign In Required",
        description: "To bookmark datasets and access other features, please sign in.",
      }}
    >
      <Button variant="ghost" size="icon" onClick={toggleBookmark}>
        <BookmarkIcon className={cn({ "fill-gold": bookmarked })} />
      </Button>
    </RequireAuth>
  );
}
