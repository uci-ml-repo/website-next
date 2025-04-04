import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium",
    "ring-offset-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm disabled:bg-secondary-foreground dark:disabled:text-secondary",
        positive:
          "bg-positive text-positive-foreground shadow-sm disabled:bg-secondary-foreground dark:disabled:text-secondary",
        outline: "border border-input bg-background shadow-sm hover:bg-secondary",
        "outline-destructive":
          "border border-input bg-background text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm",
        blue: "bg-uci-blue text-uci-blue-foreground shadow-sm",
        gold: "bg-uci-gold text-uci-gold-foreground shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-destructive": "text-destructive hover:bg-destructive hover:text-background",
        link: "!px-2 text-primary underline-offset-2 hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4 py-2 [&_svg]:size-4",
        xs: "h-6 gap-1 px-2 text-xs [&_svg]:size-3",
        sm: "h-7 gap-1.5 px-3 text-sm [&_svg]:size-4",
        lg: "h-10 gap-2 px-6 text-base [&_svg]:size-5",
        icon: "size-8 [&_svg]:size-[18px]",
        "icon-lg": "size-10 [&_svg]:size-5",
        "icon-sm": "size-5 [&_svg]:size-3.5 [&_svg]:stroke-[3]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
