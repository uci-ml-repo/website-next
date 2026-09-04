import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/util/cn";

const badgeVariants = cva(
  cn(
    "inline-flex items-center rounded-full border text-xs font-semibold transition-colors",
    "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
        outline: "text-foreground",
        blue: "border-blue bg-blue text-blue-foreground shadow",
        "blue-ghost": "border-blue bg-blue/8 text-blue dark:text-blue-foreground shadow",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "h-5 min-w-5 justify-center px-1.5 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, size, asChild, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "div";

  return <Comp className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
