"use client";

import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface CustomSplitProps {
  className?: string;
  gutterSize?: number;
  sizes?: [number, number];
  minSize?: number | [number, number];
  snapThreshold?: number;
  children: [ReactNode, ReactNode];
}

export default function Split({
  className,
  gutterSize = 6,
  sizes = [20, 80],
  minSize = 0,
  snapThreshold = 40,
  children,
}: CustomSplitProps) {
  const minSizes = useMemo<[number, number]>(() => {
    if (typeof minSize === "number") {
      return [minSize, minSize];
    }
    return minSize;
  }, [minSize]);

  const [leftPercent, setLeftPercent] = useState(sizes[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    setDragging(true);
    e.preventDefault();
  }, []);

  const onMouseUp = useCallback(() => {
    if (dragging) {
      setDragging(false);
    }
  }, [dragging]);

  const onMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!dragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const availableWidth = containerWidth - gutterSize;

      const offsetX = e.clientX - containerRect.left;

      if (offsetX <= snapThreshold) {
        setLeftPercent(0);
        return;
      }

      if (availableWidth - offsetX <= snapThreshold) {
        setLeftPercent(100);
        return;
      }

      const newLeftPercent = (offsetX / availableWidth) * 100;

      const minLeftPercent = (minSizes[0] / availableWidth) * 100;
      const minRightPercent = (minSizes[1] / availableWidth) * 100;

      if (newLeftPercent < minLeftPercent) {
        setLeftPercent(minLeftPercent);
      } else if (100 - newLeftPercent < minRightPercent) {
        setLeftPercent(100 - minRightPercent);
      } else {
        setLeftPercent(newLeftPercent);
      }
    },
    [dragging, minSizes, gutterSize, snapThreshold],
  );

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  useEffect(() => {
    setLeftPercent(sizes[0]);
  }, [sizes]);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full flex-row", className)}
    >
      <div
        style={{
          width:
            leftPercent === 0
              ? `${minSizes[0]}px`
              : `calc(${leftPercent}% - ${gutterSize / 2}px)`,
          minWidth: leftPercent === 0 ? `${minSizes[0]}px` : `${minSizes[0]}px`,
        }}
      >
        {children[0]}
      </div>

      <div
        className="relative shrink-0 cursor-col-resize bg-border hover:bg-accent"
        style={{
          width: `${gutterSize}px`,
        }}
        onMouseDown={onMouseDown}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform select-none text-xl text-muted-foreground">
          &#8942;
        </div>
      </div>

      <div
        style={{
          width:
            leftPercent === 100
              ? `${minSizes[1]}px`
              : `calc(${100 - leftPercent}% - ${gutterSize / 2}px)`,
          minWidth:
            leftPercent === 100 ? `${minSizes[1]}px` : `${minSizes[1]}px`,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
}
