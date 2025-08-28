"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  height?: number;
  gradientHeight?: number;
};

export function ShowMore({ height = 400, className, ...props }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.scrollHeight > height + 20) {
          setNeedsTruncation(true);
        } else {
          setNeedsTruncation(false);
        }
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [height]);

  return (
    <div>
      <div
        ref={contentRef}
        className={cn(
          `overflow-y-hidden`,
          !isExpanded && needsTruncation && "mask-b-from-80%",
          className,
        )}
        style={{ maxHeight: isExpanded ? "none" : `${height}px` }}
        {...props}
      />
      {needsTruncation && (
        <Button
          variant="link"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-link !p-0"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon /> Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon /> Show More
            </>
          )}
        </Button>
      )}
    </div>
  );
}
