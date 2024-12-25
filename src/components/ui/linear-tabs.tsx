"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const LinearTabsRoot = TabsPrimitive.Root;

const LinearTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { value: string }
>(({ className, children, value, ...props }, forwardedRef) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    x: 0,
    width: 0,
  });

  React.useEffect(() => {
    if (containerRef.current) {
      const activeChild = containerRef.current.querySelector(
        `[data-value="${value}"]`,
      ) as HTMLElement;

      if (activeChild) {
        const { offsetLeft, offsetWidth } = activeChild;
        setIndicatorStyle({ x: offsetLeft, width: offsetWidth });
      }
    }
  }, [value]);

  if (typeof children !== "object" || !Array.isArray(children)) {
    throw new Error("Children must be an array of react elements");
  }

  return (
    <TabsPrimitive.List
      ref={(node) => {
        containerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.RefObject<HTMLDivElement>).current = node!;
        }
      }}
      className={cn(
        "relative inline-flex h-fit w-full items-center justify-start text-muted-foreground",
        className,
      )}
      {...props}
    >
      {React.Children.map(
        children,
        (child: React.ReactElement<{ "data-value": string }>) =>
          React.cloneElement(child, {
            "data-value": (child.props as any).value,
          }),
      )}
      <motion.span
        animate={indicatorStyle}
        transition={{ ease: "easeOut", duration: 0.175 }}
        className="absolute bottom-0 !ml-0 h-[3px] rounded-t-full bg-foreground"
      />
    </TabsPrimitive.List>
  );
});
LinearTabsList.displayName = TabsPrimitive.List.displayName;

const LinearTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center whitespace-nowrap border-foreground px-1 py-2 text-xl font-medium ring-offset-background",
      "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-foreground",
      className,
    )}
    {...props}
  />
));
LinearTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const LinearTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
LinearTabsContent.displayName = TabsPrimitive.Content.displayName;

export { LinearTabsContent, LinearTabsList, LinearTabsRoot, LinearTabsTrigger };
