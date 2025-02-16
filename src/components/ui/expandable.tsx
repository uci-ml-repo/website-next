"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandableContentProps {
  children: ReactNode;
  truncationHeight?: number;
  gradientHeight?: number;
  className?: string;
}

export function Expandable({
  children,
  truncationHeight = 500,
  gradientHeight = Math.max(30, truncationHeight / 6),
  className = "",
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target.scrollHeight > truncationHeight) {
          setNeedsTruncation(true);
        } else {
          setNeedsTruncation(false);
        }
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [children, truncationHeight]);

  return (
    <div>
      <div
        ref={contentRef}
        className={cn(`relative overflow-hidden`, className)}
        style={{ maxHeight: isExpanded ? "none" : `${truncationHeight}px` }}
      >
        {children}
        {!isExpanded && needsTruncation && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background"
            style={{ height: `${gradientHeight}px` }}
          />
        )}
      </div>
      {needsTruncation && (
        <Button
          variant="link"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-link"
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
