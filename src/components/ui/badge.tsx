import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border-border bg-secondary text-secondary-foreground",
        "secondary-strong":
          "border-primary/25 bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive bg-destructive/5 text-destructive shadow",
        "destructive-muted":
          "border-destructive-muted bg-destructive-muted/5 text-destructive-muted shadow",
        positive: "border-positive bg-positive/5 text-positive shadow",
        blue: "border-uci-blue bg-uci-blue/5 text-uci-blue shadow",
        gold: "border-uci-gold bg-uci-gold/5 text-uci-gold shadow brightness-[.8]",
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

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export type BadgeSize = VariantProps<typeof badgeVariants>["size"];

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className="z-10 flex w-fit items-center rounded-full bg-background">
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    </div>
  );
}

function SpinnerBadge({
  variant,
  value,
}: {
  variant?: BadgeVariant;
  value?: string | number | null;
}) {
  if (value === undefined) {
    return null;
  }

  return (
    <Badge variant={variant}>
      {value !== null ? (
        typeof value === "number" ? (
          value.toLocaleString()
        ) : (
          value
        )
      ) : (
        <Spinner className="size-4" />
      )}
    </Badge>
  );
}

export { Badge, badgeVariants, SpinnerBadge };
