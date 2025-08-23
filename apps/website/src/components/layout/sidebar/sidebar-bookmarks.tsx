"use client";

import { useInViewport } from "@mantine/hooks";
import type { Session } from "@packages/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/util/cn";
import { skipBatch, trpc } from "@/server/trpc/query/client";

type Props = HTMLAttributes<HTMLUListElement> & {
  session: Session | null;
};

export function SidebarBookmarks({ session, className, ...props }: Props) {
  const { ref: topRef, inViewport: isAtTop } = useInViewport();
  const { ref: bottomRef, inViewport: isAtBottom } = useInViewport();

  const pathName = usePathname();
  const { data: bookmarks } = trpc.bookmark.find.byUserId.useQuery(
    { userId: session?.user.id ?? "" },
    { enabled: !!session?.user, ...skipBatch },
  );

  return !!bookmarks?.length ? (
    <ScrollArea
      className={cn(
        "min-h-0 *:*:!block",
        !isAtTop && "mask-t-from-[calc(100%-12px)] mask-t-to-100%",
        !isAtBottom && "mask-b-from-[calc(100%-12px)] mask-b-to-100%",
      )}
    >
      <div ref={topRef} />
      <ul
        className={cn("min-h-0 flex-1 space-y-1 p-2", className)}
        data-slot="dataset-bookmarks"
        {...props}
      >
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
                        <div className="truncate font-semibold">{dataset.title}</div>
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
      <div ref={bottomRef} />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  ) : null;
}
