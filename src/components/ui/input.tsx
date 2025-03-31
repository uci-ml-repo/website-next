import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full border border-input bg-input-background py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variantSize: {
        sm: "h-8 text-sm",
        default: "h-10 text-base",
        lg: "h-11 text-lg",
        xl: "h-12 text-lg",
      },
      pill: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    compoundVariants: [
      { variantSize: "sm", pill: true, class: "px-4" },
      { variantSize: "sm", pill: false, class: "px-2" },
      { variantSize: "default", pill: true, class: "px-5" },
      { variantSize: "default", pill: false, class: "px-3" },
      { variantSize: "lg", pill: true, class: "px-6" },
      { variantSize: "lg", pill: false, class: "px-4" },
      { variantSize: "xl", pill: true, class: "px-6" },
      { variantSize: "xl", pill: false, class: "px-4" },
    ],
    defaultVariants: {
      variantSize: "default",
      pill: true,
    },
  },
);

export const iconPadding = {
  left: {
    sm: { pill: "pl-8", nonPill: "pl-6" },
    default: { pill: "pl-10", nonPill: "pl-8" },
    lg: { pill: "pl-12", nonPill: "pl-10" },
    xl: { pill: "pl-12", nonPill: "pl-10" },
  },
  right: {
    sm: { pill: "pr-8", nonPill: "pr-6" },
    default: { pill: "pr-10", nonPill: "pr-8" },
    lg: { pill: "pr-12", nonPill: "pr-10" },
    xl: { pill: "pr-12", nonPill: "pr-10" },
  },
};

const iconVariants = cva("absolute flex items-center justify-center text-muted-foreground", {
  variants: {
    variantSize: {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-6 w-6",
    },
    iconPosition: {
      left: "left-2",
      right: "right-2",
    },
  },
  compoundVariants: [
    { variantSize: "default", iconPosition: "left", class: "left-3" },
    { variantSize: "lg", iconPosition: "left", class: "left-3" },
    { variantSize: "xl", iconPosition: "left", class: "left-4" },
    { variantSize: "default", iconPosition: "right", class: "right-3" },
    { variantSize: "lg", iconPosition: "right", class: "right-3" },
    { variantSize: "xl", iconPosition: "right", class: "right-4" },
  ],
  defaultVariants: {
    variantSize: "default",
    iconPosition: "left",
  },
});

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
      variantSize = "default",
      pill = true,
      icon: Icon,
      iconPosition = "left",
      onIconClick,
      iconButtonProps,
      ...props
    },
    ref,
  ) => {
    const extraPadding = Icon
      ? iconPadding[iconPosition][variantSize ?? "default"][pill ? "pill" : "nonPill"]
      : "";
    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        <input
          ref={ref}
          className={cn(inputVariants({ variantSize, pill, className }), extraPadding)}
          {...props}
        />
        {Icon &&
          (onIconClick ? (
            <button
              type="button"
              className={cn(iconVariants({ variantSize, iconPosition }))}
              onClick={onIconClick}
              {...iconButtonProps}
            >
              <Icon />
            </button>
          ) : (
            <span className={cn(iconVariants({ variantSize, iconPosition }))}>
              <Icon />
            </span>
          ))}
      </div>
    );
  },
);

Input.displayName = "Input";

export { iconVariants, Input, inputVariants };
