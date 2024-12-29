"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import type { badgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
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
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    "value" | "onValueChange" | "defaultValue"
  > {
  defaultValue: string;
  urlStore?: boolean;
}

function LinearTabs({
  defaultValue,
  urlStore = false,
  children,
  ...props
}: LinearTabsRootProps) {
  const [currentValue, setCurrentValue] = React.useState<string>(defaultValue);

  React.useEffect(() => {
    if (!urlStore) return;
    if (typeof window === "undefined") return;

    const hash = window.location.hash.slice(1);
    if (hash) {
      setCurrentValue(hash);
    }
  }, [defaultValue, urlStore]);

  React.useEffect(() => {
    if (!urlStore) return;
    if (typeof window === "undefined") return;

    function handleHashChange() {
      const hash = window.location.hash.slice(1);

      if (hash === currentValue) return;

      setCurrentValue(hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [urlStore, defaultValue, currentValue]);

  function onValueChange(val: string) {
    setCurrentValue(val);
    if (urlStore && typeof window !== "undefined") {
      window.location.hash = val;
    }
  }

  return (
    <TabsPrimitive.Root
      value={currentValue}
      onValueChange={onValueChange}
      {...props}
    >
      <TabsValueContext.Provider value={currentValue}>
        {children}
      </TabsValueContext.Provider>
    </TabsPrimitive.Root>
  );
}

const linearTabsListVariants = cva(
  "relative inline-flex h-fit w-full items-center justify-start text-muted-foreground",
  {
    variants: {
      variant: {
        default: "[&>span]:bg-foreground",
        destructive: "[&>span]:bg-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const LinearTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof linearTabsListVariants>
>(({ variant, className, children, ...props }, forwardedRef) => {
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
      className={cn(linearTabsListVariants({ variant }), className)}
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
        className="absolute bottom-0 !ml-0 h-[4px] rounded-t-full"
      />
    </TabsPrimitive.List>
  );
});
LinearTabsList.displayName = "LinearTabsList";

interface LinearTabsBorderProps extends React.HTMLAttributes<HTMLHRElement> {}

export function TabsListBorder({ className, ...props }: LinearTabsBorderProps) {
  return (
    <hr className={cn("-mt-[2px] mb-6 border-[1px]", className)} {...props} />
  );
}

type TriggerElement = React.ReactElement<{
  "data-value": string;
  value: string;
}>;

const LinearTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    badgeVariant?: VariantProps<typeof badgeVariants>["variant"];
    badgeValue?: number | string;
  }
>(
  (
    { className, children, badgeVariant = "secondary", badgeValue, ...props },
    ref,
  ) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center whitespace-nowrap px-2 py-2 text-xl font-medium ring-offset-background",
        "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    >
      {badgeValue !== undefined ? (
        <div className="flex items-center space-x-2">
          <span>{children}</span>
          <Badge variant={badgeVariant}>{badgeValue}</Badge>
        </div>
      ) : (
        children
      )}
    </TabsPrimitive.Trigger>
  ),
);
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

export { LinearTabs, LinearTabsContent, LinearTabsList, LinearTabsTrigger };
