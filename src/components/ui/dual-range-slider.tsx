"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  value: number[];
  min: number;
  max: number;
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => React.ReactNode;
  inactive?: boolean;
  log?: boolean;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    { className, label, inactive = false, labelPosition = "top", ...props },
    ref,
  ) => {
    const initialValue = props.value ?? [props.min, props.max];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          { "py-6": label },
          className,
        )}
        {...props}
        value={initialValue}
        onValueChange={(newValue: number[]) => {
          props.onValueChange?.(newValue);
        }}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range
            className={cn(
              "absolute h-full",
              inactive ? "bg-muted-foreground" : "bg-uci-blue",
            )}
          />
        </SliderPrimitive.Track>
        {initialValue.map((value, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className={cn(
              "relative block size-4 rounded-full border-2 bg-background",
              inactive ? "border-muted-foreground" : "border-uci-blue",
              "cursor-pointer ring-offset-background transition-all duration-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {label && (
              <span
                className={cn(
                  "absolute flex w-full justify-center",
                  labelPosition === "top" && "-top-6",
                  labelPosition === "bottom" && "top-4",
                )}
              >
                {label(value)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  },
);
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
