import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-transparent px-6 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variantSize: {
        sm: "h-9 text-sm",
        default: "h-10 text-base",
        lg: "h-11 px-6 text-lg",
        xl: "h-12 px-6 text-lg",
      },
      pill: {
        true: "rounded-full",
        false: "rounded-md",
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
  iconButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variantSize,
      icon: Icon,
      iconPosition = "left",
      pill = true,
      onIconClick,
      iconButtonProps,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const iconSize = {
      sm: "size-4",
      default: "size-5",
      lg: "size-6",
      xl: "size-6",
    };

    const iconOffset = {
      left: {
        sm: "left-2",
        default: "left-3",
        lg: "left-3",
        xl: "left-4",
      },
      right: {
        sm: "right-2",
        default: "right-3",
        lg: "right-3",
        xl: "right-4",
      },
    };

    const iconInputPadding = {
      sm: iconPosition === "left" ? "pl-8" : "pr-8",
      default: iconPosition === "left" ? "pl-10" : "pr-10",
      lg: iconPosition === "left" ? "pl-12" : "pr-12",
      xl: iconPosition === "left" ? "pl-12" : "pr-12",
    };

    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        <input
          className={cn(
            inputVariants({ variantSize, pill, className }),
            Icon ? iconInputPadding[variantSize || "default"] : "",
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {Icon &&
          (onIconClick ? (
            <button
              type="button"
              className={cn(
                "absolute z-20 flex cursor-pointer items-center justify-center text-muted-foreground",
                iconSize[variantSize ?? "default"],
                iconOffset[iconPosition][variantSize ?? "default"],
              )}
              onClick={onIconClick}
              {...iconButtonProps}
            >
              <Icon aria-hidden={true} />
            </button>
          ) : (
            <span
              className={cn(
                "pointer-events-none absolute flex items-center justify-center text-muted-foreground",
                iconSize[variantSize ?? "default"],
                iconOffset[iconPosition][variantSize ?? "default"],
              )}
            >
              <Icon />
            </span>
          ))}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
