"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { useMemo } from "react";

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

const Thumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Thumb>,
  {
    labelContent: React.ReactNode;
    labelRef: React.Ref<HTMLSpanElement>;
    labelClass: string;
    inactive: boolean;
  }
>(({ labelContent, labelRef, labelClass, inactive }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      "relative block size-4 rounded-full border-2 bg-background",
      inactive ? "border-muted-foreground" : "border-uci-blue",
      "cursor-pointer ring-offset-background transition-all duration-100",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    )}
  >
    {labelContent && (
      <span
        ref={labelRef}
        className={cn("absolute flex w-full justify-center", labelClass)}
      >
        {labelContent}
      </span>
    )}
  </SliderPrimitive.Thumb>
));
Thumb.displayName = "Thumb";

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    { className, label, inactive = false, labelPosition = "top", ...props },
    ref,
  ) => {
    const currentValue = useMemo(
      () => props.value ?? [props.min, props.max],
      [props.max, props.min, props.value],
    );
    const leftLabelRef = React.useRef<HTMLSpanElement>(null);
    const rightLabelRef = React.useRef<HTMLSpanElement>(null);
    const [isCollision, setIsCollision] = React.useState(false);

    React.useEffect(() => {
      if (leftLabelRef.current && rightLabelRef.current) {
        const leftRect = leftLabelRef.current.getBoundingClientRect();
        const rightRect = rightLabelRef.current.getBoundingClientRect();
        if (leftRect.right > rightRect.left) {
          setIsCollision(true);
        } else {
          setIsCollision(false);
        }
      }
    }, [currentValue]);

    const leftLabelClass = cn(
      "-right-[14px] pr-5",
      labelPosition === "top" ? "-top-6" : "top-4",
    );
    const rightLabelClass = cn(
      "-left-[14px] pl-5",
      isCollision || labelPosition === "bottom" ? "top-4" : "-top-6",
    );

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          { "py-6": label },
          className,
        )}
        {...props}
        value={currentValue}
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
        <Thumb
          labelContent={label ? label(currentValue[0]) : null}
          labelRef={leftLabelRef}
          labelClass={leftLabelClass}
          inactive={inactive}
        />
        <Thumb
          labelContent={label ? label(currentValue[1]) : null}
          labelRef={rightLabelRef}
          labelClass={rightLabelClass}
          inactive={inactive}
        />
      </SliderPrimitive.Root>
    );
  },
);
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
