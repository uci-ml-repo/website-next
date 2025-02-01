import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm disabled:bg-secondary-foreground dark:disabled:text-secondary",
        outline:
          "border border-input bg-background shadow-sm hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        blue: "bg-uci-blue text-uci-blue-foreground shadow-sm",
        gold: "bg-uci-gold text-uci-gold-foreground shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        ghostDestructive:
          "text-destructive hover:bg-destructive hover:text-background",
        link: "text-primary underline-offset-2 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 [&_svg]:size-4",
        sm: "h-7 px-3 text-sm [&_svg]:size-4",
        lg: "h-10 px-6 text-base [&_svg]:size-5",
        icon: "size-9 [&_svg]:size-4",
        "icon-lg": "size-10 [&_svg]:size-5",
      },
      pill: {
        true: "rounded-full",
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
  (
    { className, variant, size, pill = true, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, pill, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
