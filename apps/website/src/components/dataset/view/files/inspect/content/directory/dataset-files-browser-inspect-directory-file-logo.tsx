"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

import { basenameToExtension } from "@/components/dataset/view/files/inspect/content/file/dataset-files-browser-inspect-file";
import { cn } from "@/lib/util/cn";

type Props = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  basename: string;
};

export function DatasetFilesBrowserInspectDirectoryFileLogo({
  basename,
  className,
  ...props
}: Props) {
  const extension = basenameToExtension(basename);

  return (
    <Image
      src={`/img/mimetype/${extensionToLogo(extension)}`}
      alt="File thumbnail"
      className={cn("pointer-events-none drop-shadow-[0_0_0.5px_var(--foreground)]", className)}
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

    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return "image.png";

    case "html":
    case "xml":
      return "markup.png";

    case "md":
      return "markdown.png";

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

    case "zip":
    case "gz":
    case "7z":
      return "zip.png";

    default:
      return "empty.png";
  }
}
