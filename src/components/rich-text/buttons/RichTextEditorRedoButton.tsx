import { Redo2Icon } from "lucide-react";
import { useSlate } from "slate-react";

import RichTextEditorFormatTooltip from "@/components/rich-text/buttons/RichTextEditorFormatTooltip";
import { Button } from "@/components/ui/button";

export default function RichTextEditorRedoButton() {
  const editor = useSlate();

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    editor.redo();
  };

  return (
    <RichTextEditorFormatTooltip name="Redo">
      <Button
        variant="ghost"
        size="icon"
        onMouseDown={handleMouseDown}
        disabled={editor.history.redos.length === 0}
      >
        <Redo2Icon />
      </Button>
    </RichTextEditorFormatTooltip>
  );
}
