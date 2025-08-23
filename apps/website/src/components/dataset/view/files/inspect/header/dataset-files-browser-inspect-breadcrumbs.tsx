"use client";

import { useInViewport } from "@mantine/hooks";
import { HomeIcon } from "lucide-react";
import { Fragment } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectBreadcrumbsButton } from "@/components/dataset/view/files/inspect/header/dataset-files-browser-inspect-breadcrumbs-button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util/cn";

export function DatasetFilesBrowserInspectBreadcrumbs() {
  const { currentPath, setCurrentPath } = useDatasetFilesBrowser();
  const pathParts = currentPath.split("/");

  const { ref: leftRef, inViewport: isAtLeft } = useInViewport();
  const { ref: rightRef, inViewport: isAtRight } = useInViewport();

  return (
    <div className="bg-accent/80 border-border/50 h-8 min-w-0 flex-1 rounded-sm border">
      <ScrollArea
        className={cn(
          !isAtLeft && "mask-l-from-[calc(100%-16px)] mask-l-to-100%",
          !isAtRight && "mask-r-from-[calc(100%-16px)] mask-r-to-100%",
        )}
      >
        <div className="flex items-center">
          <div ref={leftRef} />
          <DatasetFilesBrowserInspectBreadcrumbsButton
            aria-label="Go to root directory"
            current={currentPath === "/"}
            disabled={currentPath === "/"}
            onClick={() => setCurrentPath("/")}
          >
            <HomeIcon className="size-4" />
          </DatasetFilesBrowserInspectBreadcrumbsButton>
          {pathParts.map((part, i) => {
            const absolutePath = pathParts.slice(0, i + 1).join("/");
            if (!part.trim()) return null;

            return (
              <Fragment key={absolutePath}>
                <div className="text-muted-foreground/50">/</div>
                <DatasetFilesBrowserInspectBreadcrumbsButton
                  aria-label={`Go to ${absolutePath}`}
                  disabled={i === pathParts.length - 1}
                  current={currentPath === absolutePath}
                  onClick={() => setCurrentPath(absolutePath)}
                >
                  {part}
                </DatasetFilesBrowserInspectBreadcrumbsButton>
              </Fragment>
            );
          })}
          <div ref={rightRef} className="w-[1px]" />
        </div>
        <ScrollBar orientation="horizontal" className="h-2 cursor-col-resize" />
      </ScrollArea>
    </div>
  );
}
