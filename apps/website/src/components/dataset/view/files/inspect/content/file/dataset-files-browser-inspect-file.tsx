"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectFileImage } from "@/components/dataset/view/files/inspect/content/file/mimetype/dataset-files-browser-inspect-file-image";
import { DatasetFilesBrowserInspectFileText } from "@/components/dataset/view/files/inspect/content/file/mimetype/dataset-files-browser-inspect-file-text";
import { ScrollArea } from "@/components/ui/scroll-area";

export function basenameToExtension(basename: string) {
  const extensionIndex = basename.lastIndexOf(".") + 1;
  return extensionIndex ? basename.slice(extensionIndex).toLowerCase() : "";
}

export function DatasetFilesBrowserInspectFile() {
  const { currentPath } = useDatasetFilesBrowser();

  const extension = basenameToExtension(currentPath.split("/").pop() || "");

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
      return <DatasetFilesBrowserInspectFileImage />;

    default:
      return (
        <ScrollArea className="group min-h-0 min-w-0 flex-1" type="auto" vertical horizontal>
          <DatasetFilesBrowserInspectFileText />
        </ScrollArea>
      );
  }
}
