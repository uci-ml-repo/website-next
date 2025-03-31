import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-tight tracking-tight underline-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-base leading-snug tracking-snug text-muted-foreground", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-3", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-4 pt-0 text-sm [&_svg]:size-[18px]", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

interface AlternativeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AlternativeCard = ({ children, className, ...props }: AlternativeCardProps) => (
  <Card className={cn("w-full bg-muted", className)} {...props}>
    <CardContent className="flex min-h-32 flex-col items-center justify-center space-y-2 px-4">
      {children}
    </CardContent>
  </Card>
);

export { AlternativeCard, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
