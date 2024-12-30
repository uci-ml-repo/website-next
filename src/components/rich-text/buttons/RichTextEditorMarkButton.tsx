import { Editor } from "slate";
import { useSlate } from "slate-react";

import RichTextEditorFormatTooltip from "@/components/rich-text/buttons/RichTextEditorFormatTooltip";
import type { RichTextMarkFormat } from "@/components/rich-text/RichText";
import { Button } from "@/components/ui/button";

export const toggleMark = (editor: Editor, format: RichTextMarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: Editor, format: RichTextMarkFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export default function RichTextEditorMarkButton({
  format,
  icon,
  name,
}: {
  format: RichTextMarkFormat;
  icon: React.ReactNode;
  name: string;
}) {
  const editor = useSlate();

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleMark(editor, format);
  };

  return (
    <RichTextEditorFormatTooltip name={name}>
      <Button
        variant={isMarkActive(editor, format) ? "gold" : "ghost"}
        size="icon"
        type="button"
        onMouseDown={handleMouseDown}
        className="shrink-0"
      >
        {icon}
      </Button>
    </RichTextEditorFormatTooltip>
  );
}
