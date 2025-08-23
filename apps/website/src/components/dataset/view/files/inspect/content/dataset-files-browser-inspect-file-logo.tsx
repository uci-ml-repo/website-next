"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/util/cn";

type Props = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  fileName: string;
};

export function DatasetFilesBrowserInspectFileLogo({ fileName, className, ...props }: Props) {
  const extensionIndex = fileName.lastIndexOf(".") + 1;
  const extension = extensionIndex ? fileName.slice(extensionIndex).toLowerCase() : "";

  return (
    <Image
      src={`/img/mimetype/${extensionToLogo(extension)}`}
      alt="File thumbnail"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    />
  );
}

function extensionToLogo(extension: string) {
  switch (extension) {
    case "mp3":
    case "wav":
      return "audio.png";
    case "r":
      return "code.png";
    case "pdf":
    case "doc":
    case "docx":
      return "doc.png";
    case "html":
    case "xml":
      return "markup.png";
    case "md":
      return "markdown.png";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "tiff":
    case "svg":
    case "webp":
      return "image.png";
    case "py":
      return "python.png";
    case "csv":
    case "tsv":
    case "xls":
    case "xlsx":
      return "tabular.png";
    case "txt":
      return "text.png";
    case "mp4":
    case "mov":
      return "video.png";
    default:
      return "empty.png";
  }
}
