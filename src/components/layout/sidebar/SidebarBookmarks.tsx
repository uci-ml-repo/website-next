import Link from "next/link";
import type { Session } from "next-auth";

import { DatasetSidebarPreview } from "@/components/dataset/preview/DatasetSidebarPreview";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarOpenVisible,
  useSidebar,
} from "@/components/ui/sidebar";
import { PROFILE_BOOKMARKS_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export function SidebarBookmarks({ session }: { session: Session | null }) {
  const { temporaryOpen, open, openMobile } = useSidebar();
  const isOpen = open || temporaryOpen || openMobile;

  const { data: bookmarks } = trpc.bookmark.find.byUserQuery.useQuery(
    {},
    {
      enabled: !!session?.user,
      trpc: {
        context: {
          skipBatch: true,
        },
      },
    },
  );

  return bookmarks && bookmarks.bookmarks.length > 0 ? (
    <SidebarOpenVisible className="min-h-0 flex-1 overflow-y-auto pt-2">
      <SidebarGroup className="hidden h-full flex-col overflow-hidden [@media_(min-height:460px)]:flex">
        <SidebarGroupLabel asChild>
          <Link
            href={PROFILE_BOOKMARKS_ROUTE}
            className="mx-2 h-fit w-fit text-sm hover:underline"
          >
            Bookmarks
          </Link>
        </SidebarGroupLabel>
        <ul className="flex min-h-0 flex-col overflow-y-auto px-2 pt-1">
          {bookmarks.bookmarks.map((datasetBookmark) => (
            <li key={datasetBookmark.dataset.id}>
              <DatasetSidebarPreview
                dataset={datasetBookmark.dataset}
                className={cn("transition-all duration-100", {
                  "-mb-8": !isOpen,
                })}
              />
            </li>
          ))}
        </ul>
      </SidebarGroup>
    </SidebarOpenVisible>
  ) : (
    <div className="flex-1" />
  );
}
