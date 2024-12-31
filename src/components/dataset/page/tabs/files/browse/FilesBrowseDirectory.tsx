import { ChevronRightIcon, FolderIcon } from "lucide-react";
import { useState } from "react";

import FileBrowseButton from "@/components/dataset/page/tabs/files/browse/FileBrowseButton";
import type { FileResponse } from "@/lib/types";

export default function FilesBrowseDirectory({ node }: { node: FileResponse }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-center">
      <FileBrowseButton>
        <ChevronRightIcon />
        <FolderIcon />
        <span>{node.name}</span>
      </FileBrowseButton>
    </div>
  );
}
