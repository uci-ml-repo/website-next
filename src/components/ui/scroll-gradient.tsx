import React from "react";

import { cn } from "@/lib/utils";

interface ScrollGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation: "vertical" | "horizontal";
  containerClassName?: string;
  className?: string;
}

export const ScrollGradient = React.forwardRef<
  HTMLDivElement,
  ScrollGradientProps
>(({ children, orientation, className, containerClassName, ...props }, ref) => {
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

    updateGradients();

    const observer = new ResizeObserver(updateGradients);
    observer.observe(node);
    node.addEventListener("scroll", updateGradients);
    window.addEventListener("resize", updateGradients);

    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", updateGradients);
      window.removeEventListener("resize", updateGradients);
    };
  }, [orientation]);

  return (
    <div className={cn("relative", containerClassName)} {...props}>
      <div className={className} ref={setRefs}>
        {children}
      </div>
      {orientation === "vertical" && showStartGradient && (
        <div className="absolute left-0 right-0 top-0 z-10 h-4 bg-gradient-to-b from-background" />
      )}
      {orientation === "vertical" && showEndGradient && (
        <div className="absolute bottom-0 left-0 right-0 z-10 h-4 bg-gradient-to-t from-background" />
      )}
      {orientation === "horizontal" && showStartGradient && (
        <div className="absolute bottom-0 left-0 top-0 z-10 w-4 bg-gradient-to-r from-background" />
      )}
      {orientation === "horizontal" && showEndGradient && (
        <div className="absolute bottom-0 right-0 top-0 z-10 w-4 bg-gradient-to-l from-background" />
      )}
    </div>
  );
});
ScrollGradient.displayName = "ScrollGradient";
