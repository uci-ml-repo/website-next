"use client";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { DatasetFilesBrowserInspectFileAudio } from "@/components/dataset/view/files/inspect/content/file/mimetype/dataset-files-browser-inspect-file-audio";
import { DatasetFilesBrowserInspectFileImage } from "@/components/dataset/view/files/inspect/content/file/mimetype/dataset-files-browser-inspect-file-image";
import { DatasetFilesBrowserInspectFileNoDisplay } from "@/components/dataset/view/files/inspect/content/file/mimetype/dataset-files-browser-inspect-file-no-display";
import { DatasetFilesBrowserInspectFilePdf } from "@/components/dataset/view/files/inspect/content/file/mimetype/dataset-files-browser-inspect-file-pdf";
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

    case "pdf":
      return <DatasetFilesBrowserInspectFilePdf />;

    case "wav":
    case "mp3":
      return <DatasetFilesBrowserInspectFileAudio />;

    case "xlsx":
    case "xls":
    case "mp4":
    case "mox":
    case "zip":
      return <DatasetFilesBrowserInspectFileNoDisplay />;

    default:
      return (
        <ScrollArea className="group min-h-0 min-w-0 flex-1" type="auto" vertical horizontal>
          <DatasetFilesBrowserInspectFileText />
        </ScrollArea>
      );
  }
}
