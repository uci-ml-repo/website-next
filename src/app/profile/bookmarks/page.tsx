import { BookmarkIcon } from "lucide-react";

import { auth } from "@/auth";
import DatasetCard from "@/components/dataset/preview/DatasetCard";
import { Card, CardContent } from "@/components/ui/card";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();
  const bookmarks = await caller.bookmark.find.byUserId(session!.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <BookmarkIcon className="size-6 fill-uci-gold" />
        <h2 className="text-2xl font-bold">Bookmarks</h2>
      </div>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {bookmarks.map((bookmark) => (
            <DatasetCard key={bookmark.dataset.id} dataset={bookmark.dataset} />
          ))}
        </div>
      ) : (
        <Card className="flex h-20 items-center justify-center bg-muted text-muted-foreground">
          <CardContent className="text-pretty text-center">
            <span>
              Visit a dataset and click the bookmark button (
              <BookmarkIcon className="mb-0.5 inline size-5" />) to save it
              here.
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
