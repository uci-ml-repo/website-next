import {
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon,
} from "lucide-react";
import Image from "next/image";
import path from "path";

import { STATIC_FILES_ROUTE } from "@/lib/routes";
import { imageExtensions } from "@/lib/utils/file";
import type { DirectoryEntity } from "@/server/service/files/find";

export default function fileToIcon(
  file: DirectoryEntity,
  renderImage: boolean = false,
) {
  if (renderImage && imageExtensions.includes(file.extension ?? "")) {
    return (
      <Image
        src={path.join(STATIC_FILES_ROUTE, file.path)}
        alt={file.path}
        width={80}
        height={80}
        className="object-cover"
      />
    );
  }

  if (file.type === "directory") {
    return <FolderIcon className="fill-foreground" />;
  }

  switch (file.extension) {
    case "txt":
    case "doc":
    case "docx":
    case "pdf":
    case "names":
    case "md":
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
