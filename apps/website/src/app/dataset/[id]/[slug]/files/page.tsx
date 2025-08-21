"use client";

import { useMounted } from "@mantine/hooks";
import { Loader2Icon } from "lucide-react";
import Split from "react-split";

import { cn } from "@/lib/util/cn";

export default function Page() {
  const mounted = useMounted();

  return mounted ? (
    <Split
      direction="horizontal"
      gutterSize={6}
      snapOffset={10}
      sizes={[20, 80]}
      minSize={[150, 250]}
      className={cn(
        "flex h-[calc(100dvh-20rem)] [&_.gutter]:cursor-col-resize",
        "[&_.gutter]:flex [&_.gutter]:items-center [&_.gutter]:justify-center",
        "[&_.gutter]:after:text-muted-foreground [&_.gutter]:after:content-['⋮']",
      )}
    >
      <div className="bg-muted rounded-l-sm">L</div>
      <div className="bg-muted rounded-r-sm">R</div>
    </Split>
  ) : (
    <div className="w-ful text-muted-foreground flex h-20 items-center justify-center space-x-2">
      <Loader2Icon className="animate-spin" />
      <div>Loading...</div>
    </div>
  );
}
