"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import type { badgeVariants } from "@/components/ui/badge";
import { Badge, SpinnerBadge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { abbreviateDecimal, cn } from "@/lib/utils";

const TabsValueContext = React.createContext<string | undefined>(undefined);

export function useTabsValue() {
  const ctx = React.useContext(TabsValueContext);
  if (ctx === undefined) {
    throw new Error("useTabsValue must be used within <LinearTabs>");
  }
  return ctx;
}

interface LinearTabsRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    "value" | "onValueChange" | "defaultValue"
  > {
  defaultValue: string;
  routerStore?: string;
  routerSegment?: number;
}

export function LinearTabs({
  defaultValue,
  routerStore,
  routerSegment,
  children,
  ...props
}: LinearTabsRootProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentValue, setCurrentValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (routerStore && routerSegment) {
      const segments = pathname.split("/").filter(Boolean);
      const nextValue = segments[routerSegment] || defaultValue;
      setCurrentValue(nextValue);
    }
  }, [defaultValue, pathname, routerSegment, routerStore]);

  function onValueChange(val: string) {
    setCurrentValue(val);
    if (routerStore) {
      router.push(`${routerStore}/${val}`);
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
  "relative inline-flex h-fit w-fit items-center justify-start space-x-8 overflow-x-hidden py-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "[&>span]:bg-foreground",
        destructive: "[&>span]:bg-destructive",
        gold: "[&>span]:bg-uci-gold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const LinearTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof linearTabsListVariants>
>(({ variant, className, children, ...props }, forwardedRef) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const activeValue = useTabsValue();

  const [showLeftGradient, setShowLeftGradient] = React.useState(false);
  const [showRightGradient, setShowRightGradient] = React.useState(false);

  const [indicatorStyle, setIndicatorStyle] = React.useState({
    x: 0,
    width: 0,
  });

  React.useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      if (!containerRef.current) return;

      const activeTrigger = containerRef.current.querySelector(
        `[data-value="${activeValue}"]`,
      ) as HTMLElement | null;
      if (activeTrigger) {
        setIndicatorStyle({
          x: activeTrigger.offsetLeft,
          width: activeTrigger.offsetWidth,
        });
      } else {
        setIndicatorStyle({ x: 0, width: 0 });
      }

      const { scrollWidth, clientWidth, scrollLeft } = containerRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollWidth > clientWidth + scrollLeft);
    };

    update();

    const observer = new ResizeObserver(() => {
      update();
    });
    observer.observe(containerRef.current);

    window.addEventListener("resize", update);
    containerRef.current.addEventListener("scroll", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [activeValue]);

  return (
    <div className="relative overflow-hidden">
      <div className="relative overflow-x-auto" ref={containerRef}>
        <TabsPrimitive.List
          ref={(node) => {
            if (typeof forwardedRef === "function") {
              forwardedRef(node as null);
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
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  "data-value": child.props.value,
                });
              }
              return child;
            },
          )}

          <motion.span
            animate={indicatorStyle}
            transition={{ ease: "easeOut", duration: 0.175 }}
            className="absolute bottom-0 !ml-0 h-[4px] rounded-t-full"
          />
        </TabsPrimitive.List>
      </div>
      {showLeftGradient && (
        <div className="absolute bottom-0 left-0 top-0 z-10 !ml-0 w-4 bg-gradient-to-r from-background" />
      )}
      {showRightGradient && (
        <div className="absolute bottom-0 right-0 top-0 z-10 !ml-0 w-4 bg-gradient-to-l from-background" />
      )}
    </div>
  );
});
LinearTabsList.displayName = "LinearTabsList";

interface LinearTabsBorderProps extends React.HTMLAttributes<HTMLHRElement> {}

export function TabsListBorder({ className, ...props }: LinearTabsBorderProps) {
  return <hr className={cn("-mt-[2px] border-[1px]", className)} {...props} />;
}

type TriggerElement = React.ReactElement<{
  "data-value": string;
  value: string;
}>;

export const LinearTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    badgeVariant?: VariantProps<typeof badgeVariants>["variant"];
    badgeValue?: number | string | null;
    link?: string;
  }
>(
  (
    {
      className,
      children,
      badgeVariant = "secondary",
      badgeValue,
      link,
      ...triggerProps
    },
    ref,
  ) => {
    if (link) {
      return (
        <TabsPrimitive.Trigger asChild ref={ref} {...triggerProps}>
          <Link
            href={link}
            className={cn(
              "data-[state=active]:text-foreground",
              "inline-flex items-center whitespace-nowrap p-1 text-xl font-medium ring-offset-background",
              "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              className,
            )}
            tabIndex={0}
            onFocus={(e) => e.preventDefault()}
            prefetch={false}
          >
            {badgeValue !== undefined ? (
              <div className="flex items-center space-x-2">
                <span>{children}</span>
                <SpinnerBadge variant={badgeVariant} value={badgeValue} />
              </div>
            ) : (
              children
            )}
          </Link>
        </TabsPrimitive.Trigger>
      );
    }

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        {...triggerProps}
        className={cn(
          "inline-flex items-center whitespace-nowrap px-2 py-2 text-xl font-medium ring-offset-background",
          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "data-[state=active]:text-foreground",
          className,
        )}
      >
        {badgeValue !== undefined ? (
          <div className="flex items-center space-x-2">
            <span>{children}</span>
            <Badge variant={badgeVariant}>
              {badgeValue ? (
                typeof badgeValue === "number" ? (
                  abbreviateDecimal(badgeValue)
                ) : (
                  badgeValue
                )
              ) : (
                <Spinner className="size-4" />
              )}
            </Badge>
          </div>
        ) : (
          children
        )}
      </TabsPrimitive.Trigger>
    );
  },
);
LinearTabsTrigger.displayName = "LinearTabsTrigger";

export const LinearTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    tabIndex={-1}
    {...props}
  />
));
LinearTabsContent.displayName = "LinearTabsContent";
