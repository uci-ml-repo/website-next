import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";

export function DatasetFilesBrowserInspectHistory() {
  const { history, forwardHistory, back, forward } = useDatasetFilesBrowser();

  return (
    <div className="flex *:size-8 *:rounded-sm">
      <Button
        variant="ghost"
        size="icon"
        disabled={!history.length}
        onClick={back}
        aria-label={
          "Go back in file history" + (history.length ? ` to ${history[history.length - 1]}` : "")
        }
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={!forwardHistory.length}
        onClick={forward}
        aria-label={
          "Go forward in file history" + (forwardHistory.length ? ` to ${forwardHistory[0]}` : "")
        }
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
