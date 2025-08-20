import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/util/cn";

const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all outline-none",
    "focus-visible:border-ring focus-visible:ring-ring aria-invalid:ring-destructive/20 aria-invalid:border-destructive focus-visible:ring-4",
    "dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        default: "bg-blue text-blue-foreground hover:bg-blue/90 shadow-xs",
        destructive:
          "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs",
        outline:
          "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 shadow-xs",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gold text-gold-foreground hover:bg-gold/80 shadow-xs",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-6 gap-1.5 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-sm has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 px-6 text-base has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9 text-sm [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
