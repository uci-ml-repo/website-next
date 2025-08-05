"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/util/cn";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 size-4 shrink-0 cursor-pointer rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px]",
        "data-[state=checked]:bg-blue data-[state=checked]:text-blue-foreground dark:data-[state=checked]:bg-blue data-[state=checked]:border-blue",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

function CheckboxLabeled({
  checked,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  checked?: CheckboxPrimitive.CheckedState;
}) {
  return (
    <div
      className={cn("group/checkgroup flex w-fit cursor-pointer items-center space-x-2", className)}
      {...props}
    >
      <Checkbox
        checked={checked}
        className="ring-ring/50 data-[state=unchecked]:group-hover/checkgroup:ring-3"
      />
      <div>{children}</div>
    </div>
  );
}

export { Checkbox, CheckboxLabeled };
