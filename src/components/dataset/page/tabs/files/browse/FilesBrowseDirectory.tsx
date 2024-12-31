import { FolderIcon } from "lucide-react";
import { useState } from "react";

import type { FileResponse } from "@/lib/types";

export default function FilesBrowseDirectory({ node }: { node: FileResponse }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex space-x-2">
      <FolderIcon />
      <span>{node.name}</span>
    </div>
  );
}
