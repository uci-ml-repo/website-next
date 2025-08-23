"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps, ComponentRef, ReactNode } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/util/cn";

interface DualRangeSliderProps extends ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => ReactNode;
}

const DualRangeSlider = forwardRef<ComponentRef<typeof SliderPrimitive.Root>, DualRangeSliderProps>(
  ({ className, label, labelPosition = "top", value, ...props }, ref) => {
    const initialValue = Array.isArray(value) ? value : [props.min, props.max];

    const labelRef0 = useRef<HTMLSpanElement>(null);
    const labelRef1 = useRef<HTMLSpanElement>(null);

    const [overlap, setOverlap] = useState(false);

    useEffect(() => {
      if (labelRef0.current && labelRef1.current) {
        const label0 = labelRef0.current.getBoundingClientRect();
        const label1 = labelRef1.current.getBoundingClientRect();

        setOverlap(label0.right > label1.left - 40 && label0.left < label1.right);
      }
    }, [value]);

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none items-center select-none", className)}
        value={value}
        {...props}
      >
        <SliderPrimitive.Track className="bg-accent-strong relative h-2 w-full grow overflow-hidden rounded-full">
          <SliderPrimitive.Range className="bg-blue absolute h-full" />
        </SliderPrimitive.Track>
        {initialValue.map((value, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className={cn(
              "border-blue bg-background ring-offset-background focus-visible:ring-ring relative block size-4 cursor-pointer rounded-full border-2 transition-colors",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {label && (
              <span
                ref={index === 0 ? labelRef0 : labelRef1}
                className={cn(
                  "absolute flex w-full justify-center",
                  labelPosition === "top" && "-top-7",
                  labelPosition === "bottom" && "top-4",
                  overlap && index === 1 && "translate-y-12",
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
