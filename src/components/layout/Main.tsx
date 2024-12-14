import * as React from "react";

import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export default function Main({ children, ...props }: MainProps) {
  return (
    <div className={"flex justify-center"}>
      <main {...props} className={cn("content", props.className)}>
        {children}
      </main>
    </div>
  );
}
