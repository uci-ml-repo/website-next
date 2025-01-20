"use client";

import { motion } from "motion/react";
import type {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
} from "react";
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
  setSizes?: React.Dispatch<React.SetStateAction<[number, number]>>;
  minSize?: number | [number, number];
  snapThreshold?: number;
  children: [ReactNode, ReactNode];
}

export default function Split({
  className,
  gutterSize = 6,
  sizes = [20, 80],
  setSizes,
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

  const [shouldAnimate, setShouldAnimate] = useState(false);

  const calculatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const availableWidth = containerWidth - gutterSize;

      const offsetX = clientX - containerRect.left;

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

      if (setSizes) {
        setSizes([newLeftPercent, 100 - newLeftPercent]);
      }
    },
    [gutterSize, snapThreshold, minSizes, setSizes],
  );

  useEffect(() => {
    if (dragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.userSelect = "";
    };
  }, [dragging]);

  const onMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setShouldAnimate(false);
    e.preventDefault();
  }, []);

  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    setDragging(true);
    setShouldAnimate(false);
    e.preventDefault();
  }, []);

  const onMouseUp = useCallback(() => {
    if (dragging) {
      setDragging(false);
    }
  }, [dragging]);

  const onTouchEnd = useCallback(() => {
    if (dragging) {
      setDragging(false);
    }
  }, [dragging]);

  const onMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!dragging) return;
      calculatePosition(e.clientX);
    },
    [dragging, calculatePosition],
  );

  const onTouchMove = useCallback(
    (e: globalThis.TouchEvent) => {
      if (!dragging) return;
      if (e.touches.length > 0) {
        calculatePosition(e.touches[0].clientX);
      }
    },
    [dragging, calculatePosition],
  );

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  useEffect(() => {
    setShouldAnimate(true);
    setLeftPercent(sizes[0]);
  }, [sizes]);

  const handleAnimationComplete = useCallback(() => {
    setShouldAnimate(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full flex-row", className)}
    >
      <motion.div
        animate={{
          width:
            leftPercent === 0
              ? `${minSizes[0]}px`
              : `calc(${leftPercent}% - ${gutterSize / 2}px)`,
          minWidth: `${minSizes[0]}px`,
        }}
        transition={{ duration: shouldAnimate ? 0.3 : 0 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {children[0]}
      </motion.div>

      <div
        className="relative shrink-0 cursor-col-resize touch-none bg-border hover:bg-accent"
        style={{
          width: `${gutterSize}px`,
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform select-none text-xl text-muted-foreground">
          &#8942;
        </div>
      </div>

      <motion.div
        animate={{
          width:
            leftPercent === 100
              ? `${minSizes[1]}px`
              : `calc(${100 - leftPercent}% - ${gutterSize / 2}px)`,
          minWidth: `${minSizes[1]}px`,
        }}
        transition={{ duration: shouldAnimate && leftPercent !== 0 ? 0.3 : 0 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {children[1]}
      </motion.div>
    </div>
  );
}
