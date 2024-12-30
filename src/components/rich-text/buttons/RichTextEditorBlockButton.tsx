import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";

import RichTextEditorFormatTooltip from "@/components/rich-text/buttons/RichTextEditorFormatTooltip";
import type { RichTextBlockFormat } from "@/components/rich-text/RichText";
import { Button } from "@/components/ui/button";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export default function RichTextEditorBlockButton({
  format,
  icon,
  name,
}: {
  format: RichTextBlockFormat;
  icon: React.ReactNode;
  name: string;
}) {
  const editor = useSlate();

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <RichTextEditorFormatTooltip name={name}>
      <Button
        variant={isBlockActive(editor, format) ? "gold" : "ghost"}
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

const isBlockActive = (
  editor: Editor,
  format: RichTextBlockFormat,
): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => SlateElement.isElement(n) && n.type === format,
    }),
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: RichTextBlockFormat) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive
      ? "paragraph"
      : isList
        ? "list-item"
        : (format as "block-quote" | "heading-one" | "heading-two"),
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: SlateElement = {
      type: format as "bulleted-list" | "numbered-list",
      children: [],
    };
    Transforms.wrapNodes(editor, block);
  }
};
