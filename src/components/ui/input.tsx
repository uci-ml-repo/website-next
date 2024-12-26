import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-transparent px-6 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variantSize: {
        default: "h-10 text-sm",
        lg: "h-11 px-6 text-lg",
        xl: "h-12 px-6 text-lg",
      },
      pill: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variantSize: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variantSize,
      icon: Icon,
      iconPosition = "left",
      pill = true,
      onIconClick,
      ...props
    },
    ref,
  ) => {
    const iconSize = {
      default: "*:size-4",
      lg: "*:size-6",
      xl: "*:size-6",
    };

    const iconOffset = {
      left: variantSize === "lg" ? "left-3" : "left-4",
      right: variantSize === "lg" ? "right-3" : "right-4",
    };

    const iconInputPadding = {
      default: iconPosition === "left" ? "pl-10" : "pr-10",
      lg: iconPosition === "left" ? "pl-12" : "pr-12",
      xl: iconPosition === "left" ? "pl-12" : "pr-12",
    };

    return (
      <div className={cn("relative flex items-center")}>
        {Icon && (
          <span
            className={cn(
              "absolute flex size-6 items-center justify-center text-muted-foreground",
              onIconClick ? "z-20 cursor-pointer" : "pointer-events-none",
              iconSize[variantSize || "default"],
              iconOffset[iconPosition],
            )}
            onClick={onIconClick}
          >
            <Icon />
          </span>
        )}
        <input
          className={cn(
            inputVariants({ variantSize, pill, className }),
            Icon ? iconInputPadding[variantSize || "default"] : "",
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
