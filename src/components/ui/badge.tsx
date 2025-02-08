import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive bg-destructive/5 text-destructive shadow",
        blue: "bg-blue border-uci-blue bg-uci-blue/5 text-uci-blue shadow",
        outline: "text-foreground",
      },
      size: {
        default: "",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className="z-10 flex items-center rounded-full bg-background">
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    </div>
  );
}

export { Badge, badgeVariants };
