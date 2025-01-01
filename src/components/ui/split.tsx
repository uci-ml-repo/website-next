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
  children: [ReactNode, ReactNode];
}

export default function Split({
  className,
  gutterSize = 6,
  sizes = [20, 80],
  minSize = 150,
  children,
}: CustomSplitProps) {
  const minSizes = useMemo<[number, number]>(() => {
    if (typeof minSize === "number") {
      return [minSize, minSize];
    }
    return minSize;
  }, [minSize]);

  const [leftPercent, setLeftPercent] = useState(sizes[0]);
  const rightPercent = 100 - leftPercent;

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

      const offsetX = e.clientX - containerRect.left;
      const newLeftPercent = (offsetX / containerWidth) * 100;

      const minLeftPercent = (minSizes[0] / containerWidth) * 100;
      const minRightPercent = (minSizes[1] / containerWidth) * 100;

      if (newLeftPercent < minLeftPercent) {
        setLeftPercent(minLeftPercent);
      } else if (100 - newLeftPercent < minRightPercent) {
        setLeftPercent(100 - minRightPercent);
      } else {
        setLeftPercent(newLeftPercent);
      }
    },
    [dragging, minSizes],
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

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full flex-row", className)}
    >
      <div
        style={{
          width: `${leftPercent}%`,
        }}
      >
        {children[0]}
      </div>

      <div
        className="relative cursor-col-resize bg-border hover:bg-accent"
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
          width: `${rightPercent}%`,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
}
