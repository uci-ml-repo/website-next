import {
  FileAudio2Icon,
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

import {
  audioExtensions,
  imageExtensions,
  videoExtensions,
} from "@/components/dataset/tabs/files/lib/extensions";
import { STATIC_FILES_ROUTE } from "@/lib/routes";
import type { DirectoryEntity } from "@/server/service/file/find";

export function fileToIcon(
  file: DirectoryEntity,
  renderImage: boolean = false,
) {
  const extension = path.extname(file.path);

  if (imageExtensions.includes(extension)) {
    if (renderImage) {
      return (
        <Image
          src={path.join(STATIC_FILES_ROUTE, file.path)}
          alt={file.path}
          width={80}
          height={80}
          className="max-h-full object-contain"
        />
      );
    }

    return <FileImageIcon />;
  }

  if (videoExtensions.includes(extension)) {
    return <FileVideoIcon />;
  }

  if (audioExtensions.includes(extension)) {
    return <FileAudio2Icon />;
  }

  if (file.type === "directory") {
    return <FolderIcon className="fill-foreground" />;
  }

  switch (extension) {
    case ".txt":
    case ".doc":
    case ".docx":
    case ".pdf":
    case ".names":
    case ".md":
      return <FileTextIcon />;
    case ".csv":
    case ".tsv":
    case ".data":
    case ".test":
      return <FileSpreadsheetIcon />;
    case ".json":
    case ".yaml":
    case ".yml":
      return <FileJsonIcon />;
    case ".ipynb":
    case ".py":
    case ".html":
    case ".xml":
    case ".r":
    case ".lisp":
    case ".mat":
      return <FileCodeIcon />;
    default:
      return <FileIcon />;
  }
}
