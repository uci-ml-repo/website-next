"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/util/cn";

type Props = Omit<ComponentProps<typeof Image>, "src" | "alt">;

export function DatasetFilesBrowserInspectDirectoryLogo({ className, ...props }: Props) {
  return (
    <Image
      src="/img/mimetype/folder.png"
      alt="Folder thumbnail"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    />
  );
}
