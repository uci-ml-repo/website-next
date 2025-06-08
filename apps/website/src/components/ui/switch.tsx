import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@website/lib/utils/cn";
import React from "react";

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>;

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, children, ...props }, ref) => (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className,
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0",
          "transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        )}
      >
        <div className="flex h-full items-center justify-center">{children}</div>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  ),
);

Switch.displayName = SwitchPrimitives.Root.displayName;
