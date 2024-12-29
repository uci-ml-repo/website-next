"use client";

import isHotkey from "is-hotkey";
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
} from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";
import React, { useCallback, useMemo } from "react";
import type { BaseEditor, Descendant } from "slate";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import type {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Editable, Slate, useSlate, withReact } from "slate-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import styles from "./RichText.module.css";

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type ParagraphElement = { type: "paragraph"; children: CustomText[] };
type HeadingOneElement = { type: "heading-one"; children: CustomText[] };
type HeadingTwoElement = { type: "heading-two"; children: CustomText[] };
type BlockQuoteElement = { type: "block-quote"; children: CustomText[] };
type BulletedListElement = { type: "bulleted-list"; children: CustomText[] };
type NumberedListElement = { type: "numbered-list"; children: CustomText[] };
type ListItemElement = { type: "list-item"; children: CustomText[] };

type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS: Record<string, MarkFormat> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

type MarkFormat = "bold" | "italic" | "underline" | "code";
type BlockFormat =
  | "block-quote"
  | "list-item"
  | "bulleted-list"
  | "numbered-list";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

interface RichTextEditorProps {
  spellCheck?: boolean;
  autoFocus?: boolean;
  initialValue?: Descendant[];
  placeholder?: string;
  className?: string;
  onValueChange?: (value: Descendant[]) => void;
}

export default function RichTextEditor({
  placeholder,
  className,
  spellCheck = false,
  autoFocus = false,
  initialValue = [{ type: "paragraph", children: [{ text: "" }] }],
  onValueChange,
}: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={onValueChange}
    >
      <div className="space-y-2">
        <div className="mb-2 flex items-center space-x-1">
          <MarkButton format="bold" icon={<BoldIcon />} />
          <ButtonSeparator />
          <MarkButton format="italic" icon={<ItalicIcon />} />
          <ButtonSeparator />
          <MarkButton format="underline" icon={<UnderlineIcon />} />
          <ButtonSeparator />
          <MarkButton format="code" icon={<Code2Icon />} />
          <ButtonSeparator />
          <BlockButton
            format="block-quote"
            icon={<QuoteIcon className="!size-3 fill-foreground" />}
          />
          <ButtonSeparator />
          <BlockButton format="numbered-list" icon={<ListOrderedIcon />} />
          <ButtonSeparator />
          <BlockButton format="bulleted-list" icon={<ListIcon />} />
        </div>
        <Separator />

        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck={spellCheck}
          autoFocus={autoFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            styles.rich,
            "w-full rounded-xl border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        />
      </div>
    </Slate>
  );
}

const ButtonSeparator = () => (
  <Separator orientation="vertical" className="h-6" />
);

const toggleBlock = (editor: Editor, format: string) => {
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

const toggleMark = (editor: Editor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    }),
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: MarkFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf: React.FC<RenderLeafProps> = (props) => {
  let { children } = props;
  const { leaf, attributes } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({
  format,
  icon,
}: {
  format: BlockFormat;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onMouseDown={handleMouseDown}
      className={
        isBlockActive(editor, format) ? "bg-uci-gold hover:bg-uci-gold" : ""
      }
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({
  format,
  icon,
}: {
  format: MarkFormat;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleMark(editor, format);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onMouseDown={handleMouseDown}
      className={
        isMarkActive(editor, format) ? "bg-uci-gold hover:bg-uci-gold" : ""
      }
    >
      {icon}
    </Button>
  );
};
