import { cva, type VariantProps } from "class-variance-authority";
import { CircleXIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputClearableVariants = cva(
  "flex w-full rounded-md border border-input bg-input-background px-6 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
      },
    },
    defaultVariants: {
      variantSize: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputClearableVariants> {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const InputClearable = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variantSize,
      icon: Icon,
      iconPosition = "left",
      pill = true,
      value,
      setValue,
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
        {Icon && (
          <span
            className={cn(
              "pointer-events-none absolute flex items-center justify-center text-muted-foreground",
              iconSize[variantSize ?? "default"],
              iconOffset[iconPosition][variantSize ?? "default"],
            )}
          >
            <Icon />
          </span>
        )}
        <input
          className={cn(
            inputClearableVariants({ variantSize, pill, className }),
            Icon ? iconInputPadding[variantSize || "default"] : "",
            value ? "pr-10" : "",
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          autoComplete="off"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setValue("");
            }}
            className="absolute right-3 flex items-center justify-center text-muted-foreground"
            aria-label="Clear input"
          >
            <CircleXIcon className="size-5" />
          </button>
        )}
      </div>
    );
  },
);

InputClearable.displayName = "Input";

export { InputClearable, inputClearableVariants };
