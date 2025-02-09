import { LoaderCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderCircleIcon
      className={cn("size-6 animate-spin", className)}
      {...props}
    />
  );
}
