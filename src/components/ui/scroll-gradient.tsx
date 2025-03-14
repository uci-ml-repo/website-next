import React from "react";

import { cn } from "@/lib/utils";

interface ScrollGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation: "vertical" | "horizontal";
  containerClassName?: string;
  className?: string;
  gradientClassName?: string;
}

export const ScrollGradient = React.forwardRef<
  HTMLDivElement,
  ScrollGradientProps
>(
  (
    {
      children,
      orientation,
      className,
      containerClassName,
      gradientClassName,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null);

    const setRefs = (node: HTMLDivElement) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const [showStartGradient, setShowStartGradient] = React.useState(false);
    const [showEndGradient, setShowEndGradient] = React.useState(false);
    const [childDims, setChildDims] = React.useState<{
      left: number;
      top: number;
      width: number;
      height: number;
    }>({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });

    React.useEffect(() => {
      const node = localRef.current;
      if (!node) return;

      const updateGradients = () => {
        if (orientation === "vertical") {
          const { scrollTop, scrollHeight, clientHeight } = node;
          setShowStartGradient(scrollTop > 0);
          setShowEndGradient(scrollTop + clientHeight < scrollHeight);
        } else {
          const { scrollLeft, scrollWidth, clientWidth } = node;
          setShowStartGradient(scrollLeft > 0);
          setShowEndGradient(scrollLeft + clientWidth < scrollWidth);
        }
      };

      const updateChildDims = () => {
        const firstChild = node.firstElementChild as HTMLElement | null;
        if (firstChild) {
          setChildDims({
            left: firstChild.offsetLeft,
            top: firstChild.offsetTop,
            width: firstChild.offsetWidth,
            height: firstChild.offsetHeight,
          });
        }
      };

      updateGradients();
      updateChildDims();

      const observer = new ResizeObserver(() => {
        updateGradients();
        updateChildDims();
      });
      observer.observe(node);
      if (node.firstElementChild) {
        observer.observe(node.firstElementChild);
      }

      node.addEventListener("scroll", updateGradients);
      window.addEventListener("resize", updateChildDims);

      return () => {
        observer.disconnect();
        node.removeEventListener("scroll", updateGradients);
        window.removeEventListener("resize", updateChildDims);
      };
    }, [orientation]);

    // For vertical gradients, use the first child’s left offset and width.
    const verticalStyle =
      childDims.width > 0
        ? { left: childDims.left, width: childDims.width }
        : {};
    // For horizontal gradients, use the first child’s top offset and height.
    const horizontalStyle =
      childDims.height > 0
        ? { top: childDims.top, height: childDims.height }
        : {};

    return (
      <div className={cn("relative", containerClassName)} {...props}>
        <div className={cn(className)} ref={setRefs}>
          {children}
        </div>
        {orientation === "vertical" && (
          <div
            data-orientation="vertical"
            style={verticalStyle}
            className={cn(
              "pointer-events-none absolute top-0 z-10 h-4 bg-gradient-to-b from-background",
              showStartGradient ? "opacity-100" : "opacity-0",
              "transition-opacity duration-150",
              gradientClassName,
            )}
          />
        )}
        {orientation === "vertical" && (
          <div
            data-orientation="vertical"
            style={verticalStyle}
            className={cn(
              "pointer-events-none absolute bottom-0 z-10 h-4 bg-gradient-to-t from-background",
              showEndGradient ? "opacity-100" : "opacity-0",
              "transition-opacity duration-150",
              gradientClassName,
            )}
          />
        )}
        {orientation === "horizontal" && (
          <div
            data-orientation="horizontal"
            style={horizontalStyle}
            className={cn(
              "pointer-events-none absolute left-0 z-10 w-4 bg-gradient-to-r from-background",
              showStartGradient ? "opacity-100" : "opacity-0",
              "transition-opacity duration-150",
              gradientClassName,
            )}
          />
        )}
        {orientation === "horizontal" && (
          <div
            data-orientation="horizontal"
            style={horizontalStyle}
            className={cn(
              "pointer-events-none absolute right-0 z-10 w-4 bg-gradient-to-l from-background",
              showEndGradient ? "opacity-100" : "opacity-0",
              "transition-opacity duration-150",
              gradientClassName,
            )}
          />
        )}
      </div>
    );
  },
);
ScrollGradient.displayName = "ScrollGradient";
