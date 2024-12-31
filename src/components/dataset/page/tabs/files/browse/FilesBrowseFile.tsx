import {
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
} from "lucide-react";

import type { FileResponse } from "@/lib/types";

function extensionToIcon(extension: string | undefined) {
  switch (extension) {
    case "txt":
    case "doc":
    case "docx":
    case "pdf":
      return <FileTextIcon />;
    case "csv":
    case "tsv":
    case "data":
    case "xls":
    case "xlsx":
      return <FileSpreadsheetIcon />;
    case "json":
    case "yaml":
    case "yml":
      return <FileJsonIcon />;
    case "ipynb":
    case "py":
    case "html":
    case "xml":
    case "r":
    case "lisp":
    case "mat":
      return <FileCodeIcon />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
    case "bmp":
    case "tiff":
      return <FileImageIcon />;
    case "wav":
    case "mp3":
      return <FileAudioIcon />;
    case "mp4":
    case "avi":
    case "mov":
      return <FileVideoIcon />;
    default:
      return <FileIcon />;
  }
}

export default function FilesBrowseFile({ node }: { node: FileResponse }) {
  return (
    <div className="flex space-x-2">
      {extensionToIcon(node.extension)}
      <div>{node.name}</div>
    </div>
  );
}
