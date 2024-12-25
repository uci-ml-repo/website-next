"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const TabsValueContext = React.createContext<string | undefined>(undefined);

function useTabsValue() {
  const ctx = React.useContext(TabsValueContext);
  if (ctx === undefined) {
    throw new Error("useTabsValue must be used within <LinearTabsRoot>");
  }
  return ctx;
}

interface LinearTabsRootProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  defaultValue: string;
}

function LinearTabsRoot({
  defaultValue,
  children,
  ...props
}: LinearTabsRootProps) {
  const [currentValue, setCurrentValue] = React.useState(defaultValue);

  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      onValueChange={(val) => setCurrentValue(val)}
      {...props}
    >
      <TabsValueContext.Provider value={currentValue}>
        {children}
      </TabsValueContext.Provider>
    </TabsPrimitive.Root>
  );
}

const LinearTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, forwardedRef) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const activeValue = useTabsValue();

  const [indicatorStyle, setIndicatorStyle] = React.useState({
    x: 0,
    width: 0,
  });

  React.useEffect(() => {
    if (!containerRef.current) return;

    const activeTrigger = containerRef.current.querySelector(
      `[data-value="${activeValue}"]`,
    ) as HTMLElement | null;

    if (activeTrigger) {
      const { offsetLeft, offsetWidth } = activeTrigger;
      setIndicatorStyle({ x: offsetLeft, width: offsetWidth });
    } else {
      setIndicatorStyle({ x: 0, width: 0 });
    }
  }, [activeValue]);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        containerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
        }
      }}
      className={cn(
        "relative inline-flex h-fit w-full items-center justify-start text-muted-foreground",
        className,
      )}
      {...props}
    >
      {React.Children.map(
        children as TriggerElement[],
        (child: TriggerElement) => {
          if (
            React.isValidElement(child) &&
            typeof child.props.value === "string"
          ) {
            return React.cloneElement(child, {
              "data-value": child.props.value,
            });
          }
          return child;
        },
      )}
      <motion.span
        animate={indicatorStyle}
        transition={{ ease: "easeOut", duration: 0.2 }}
        className="absolute bottom-0 !ml-0 h-[4px] rounded-t-full bg-foreground"
      />
    </TabsPrimitive.List>
  );
});
LinearTabsList.displayName = "LinearTabsList";

type TriggerElement = React.ReactElement<{
  "data-value": string;
  value: string;
}>;

const LinearTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center whitespace-nowrap px-2 py-2 text-xl font-medium ring-offset-background",
      "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=active]:text-foreground",
      className,
    )}
    {...props}
  />
));
LinearTabsTrigger.displayName = "LinearTabsTrigger";

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
LinearTabsContent.displayName = "LinearTabsContent";

export { LinearTabsContent, LinearTabsList, LinearTabsRoot, LinearTabsTrigger };
