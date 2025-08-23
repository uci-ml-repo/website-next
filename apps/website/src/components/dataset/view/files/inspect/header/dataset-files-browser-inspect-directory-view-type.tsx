import { LayoutGridIcon, LayoutListIcon } from "lucide-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";

export function DatasetFilesBrowserInspectDirectoryViewType() {
  const { directoryViewType, setDirectoryViewType } = useDatasetFilesBrowser();

  return (
    <Button
      variant="ghost"
      className="size-8 rounded-sm *:!size-4"
      size="icon"
      onClick={() => setDirectoryViewType((prev) => (prev === "rows" ? "grid" : "rows"))}
      aria-label={`View as ${directoryViewType === "rows" ? "grid" : "rows"}`}
    >
      {directoryViewType === "rows" ? <LayoutGridIcon /> : <LayoutListIcon />}
    </Button>
  );
}
