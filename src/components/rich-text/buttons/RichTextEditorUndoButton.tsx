import { Undo2Icon } from "lucide-react";
import { useSlate } from "slate-react";

import RichTextEditorFormatTooltip from "@/components/rich-text/buttons/RichTextEditorFormatTooltip";
import { Button } from "@/components/ui/button";

export default function RichTextEditorUndoButton() {
  const editor = useSlate();

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    editor.undo();
  };

  return (
    <RichTextEditorFormatTooltip name="Undo">
      <Button
        variant="ghost"
        size="icon"
        onMouseDown={handleMouseDown}
        disabled={editor.history.undos.length === 0}
      >
        <Undo2Icon />
      </Button>
    </RichTextEditorFormatTooltip>
  );
}
