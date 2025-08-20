"use client";

import type { Session } from "@packages/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/util/cn";
import { trpc } from "@/server/trpc/query/client";

export function SidebarBookmarks({ session }: { session: Session | null }) {
  const pathName = usePathname();

  const { data: bookmarks } = trpc.bookmark.find.byUserId.useQuery(
    { userId: session?.user.id ?? "" },
    { enabled: !!session?.user },
  );

  return bookmarks ? (
    <div className="animate-in fade-in space-y-2">
      <div className="text-muted-foreground">Bookmarks</div>
      <ul className="max-h-full space-y-1 overflow-y-auto">
        <TooltipProvider>
          {bookmarks.map(({ dataset }) => {
            const isActive = pathName.startsWith(ROUTES.DATASET(dataset));

            return (
              <li key={dataset.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={ROUTES.DATASET(dataset)}
                      className={cn(
                        "hover:bg-accent focus-visible:bg-accent flex items-center justify-between gap-x-2 rounded-md px-2 py-1",
                        isActive && "bg-accent",
                      )}
                    >
                      <div className="flex items-center gap-x-2 overflow-hidden">
                        <Image
                          src={ROUTES.DATASET.THUMBNAIL(dataset)}
                          alt="Thumbnail"
                          height={100}
                          width={100}
                          className="size-8 rounded-sm object-cover object-center"
                        />
                        <div className="truncate font-bold">{dataset.title}</div>
                      </div>
                      {isActive && <div className="bg-foreground size-1.5 shrink-0 rounded-full" />}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-base">
                    {dataset.title}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </TooltipProvider>
      </ul>
    </div>
  ) : null;
}
