import { type VariantProps } from "class-variance-authority";
import { CircleXIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { iconPadding, iconVariants, inputVariants } from "./input"; // adjust the import path as needed

export interface InputClearableProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  setValue: (value: string) => void;
}

const InputClearable = React.forwardRef<HTMLInputElement, InputClearableProps>(
  (
    {
      className,
      containerClassName,
      variantSize = "default",
      pill = true,
      icon: Icon,
      iconPosition = "left",
      value,
      setValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const extraIconPadding = Icon
      ? iconPadding[iconPosition][variantSize ?? "default"][pill ? "pill" : "nonPill"]
      : "";
    const clearButtonPadding = value ? "pr-10" : "";

    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        {Icon && iconPosition === "left" && (
          <span className={cn(iconVariants({ variantSize, iconPosition: "left" }))}>
            <Icon />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            inputVariants({ variantSize, pill, className }),
            Icon && extraIconPadding,
            clearButtonPadding,
          )}
          value={value}
          onChange={onChange}
          autoComplete="off"
          {...props}
        />
        {Icon && iconPosition === "right" && (
          <span
            className={cn(iconVariants({ variantSize, iconPosition: "right" }), value && "mr-4")}
          >
            <Icon />
          </span>
        )}
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
            <CircleXIcon
              className={
                variantSize === "sm"
                  ? "size-4"
                  : variantSize === "default"
                    ? "size-5"
                    : variantSize === "lg"
                      ? "size-6"
                      : "size-6"
              }
            />
          </button>
        )}
      </div>
    );
  },
);

InputClearable.displayName = "InputClearable";

export { InputClearable };
