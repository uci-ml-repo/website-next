import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircleIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive",
        positive:
          "border-positive/50 bg-positive/5 text-positive dark:border-positive [&>svg]:text-positive",
        blue: "border-uci-blue/50 bg-uci-blue/5 text-uci-blue dark:border-uci-blue [&>svg]:text-uci-blue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

const AlertInfo = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Alert variant="blue" className={className}>
    <div className="flex items-center space-x-2">
      <AlertCircleIcon className="size-5" />
      <div>{children}</div>
    </div>
  </Alert>
);

const AlertWarning = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Alert variant="destructive" className={className}>
    <div className="flex items-center space-x-2">
      <AlertCircleIcon className="size-5" />
      <div>
        <span className="font-bold">Warning:</span> {children}
      </div>
    </div>
  </Alert>
);

const AlertError = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <Alert variant="destructive" className={className}>
      <div className="flex items-center space-x-2">
        <AlertCircleIcon className="size-5" />
        <div>
          <span className="font-bold">Error:</span> {children}
        </div>
      </div>
    </Alert>
  );
};

export { Alert, AlertDescription, AlertError, AlertInfo, AlertTitle, AlertWarning };
