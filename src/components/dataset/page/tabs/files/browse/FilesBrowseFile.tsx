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

import FileBrowseButton from "@/components/dataset/page/tabs/files/browse/FileBrowseButton";
import type { FileResponse } from "@/lib/types";

export default function FilesBrowseFile({ node }: { node: FileResponse }) {
  return (
    <FileBrowseButton className="ml-7">
      {extensionToIcon(node.extension)}
      <span className="text-nowrap">{node.name}</span>
    </FileBrowseButton>
  );
}

function extensionToIcon(extension: string | undefined) {
  switch (extension) {
    case "txt":
    case "doc":
    case "docx":
    case "pdf":
    case "names":
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
