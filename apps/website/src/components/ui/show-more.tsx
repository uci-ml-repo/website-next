"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  height?: number;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

export function ShowMore({ height = 400, expanded, onExpandedChange, className, ...props }: Props) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : uncontrolled;
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const check = () => setNeedsTruncation(el.scrollHeight > height + 20);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();
    return () => ro.disconnect();
  }, [height]);

  const toggle = () => {
    const next = !isExpanded;
    if (!isControlled) setUncontrolled(next);
    onExpandedChange?.(next);
  };

  return (
    <div>
      <div
        ref={contentRef}
        className={cn(
          "overflow-y-hidden",
          !isExpanded && needsTruncation && "mask-b-from-80%",
          className,
        )}
        style={{ maxHeight: isExpanded ? "none" : `${height}px` }}
        {...props}
      />
      {needsTruncation && (
        <Button variant="link" onClick={toggle} className="text-link !p-0">
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
