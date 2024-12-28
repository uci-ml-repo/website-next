import { BookmarkIcon } from "lucide-react";

import DatasetCard from "@/components/dataset/summarized/DatasetCard";
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {bookmarks.map((bookmark, index) => (
          <DatasetCard key={index} dataset={bookmark.dataset} />
        ))}
      </div>
    </div>
  );
}
