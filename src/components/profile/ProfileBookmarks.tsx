import { BookmarkIcon } from "lucide-react";

import DatasetCard from "@/components/dataset/summarized/DatasetCard";
import { Card, CardContent } from "@/components/ui/card";
import type { BookmarkResponse } from "@/lib/types";

export default function ProfileBookmarks({
  bookmarks,
}: {
  bookmarks: BookmarkResponse[];
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <BookmarkIcon className="size-6 fill-uci-gold" />
        <h2 className="text-2xl font-bold">Bookmarks</h2>
      </div>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {bookmarks.map((bookmark, index) => (
            <DatasetCard key={index} dataset={bookmark.dataset} />
          ))}
        </div>
      ) : (
        <Card className="flex h-20 items-center justify-center bg-muted text-muted-foreground">
          <CardContent className="flex items-center text-pretty text-center">
            <span>Visit a dataset and click the bookmark button (</span>
            <BookmarkIcon className="size-5" />
            <span>) to save it here.</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
