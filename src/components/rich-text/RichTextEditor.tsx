"use client";

import isHotkey from "is-hotkey";
import {
  BoldIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import React, { useCallback, useMemo } from "react";
import type { BaseEditor, Descendant } from "slate";
import { createEditor, Editor } from "slate";
import type { HistoryEditor } from "slate-history";
import { withHistory } from "slate-history";
import type {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Editable, Slate, withReact } from "slate-react";

import RichTextEditorBlockButton from "@/components/rich-text/buttons/RichTextEditorBlockButton";
import RichTextEditorMarkButton, {
  toggleMark,
} from "@/components/rich-text/buttons/RichTextEditorMarkButton";
import RichTextEditorRedoButton from "@/components/rich-text/buttons/RichTextEditorRedoButton";
import RichTextEditorUndoButton from "@/components/rich-text/buttons/RichTextEditorUndoButton";
import type {
  ElementFormat,
  LeafFormat,
  RichTextBlockFormat,
  RichTextFormat,
  RichTextMarkFormat,
} from "@/components/rich-text/RichText";
import { allRichTextFormats } from "@/components/rich-text/RichText";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import styles from "./RichText.module.css";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: ElementFormat;
    Text: LeafFormat;
  }
}

const HOTKEYS: Record<string, RichTextMarkFormat> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const formatOptions: {
  type: "mark" | "block";
  format: RichTextFormat;
  name: string;
  icon: React.ReactNode;
}[] = [
  { type: "mark", format: "bold", name: "Bold", icon: <BoldIcon /> },
  { type: "mark", format: "italic", name: "Italic", icon: <ItalicIcon /> },
  {
    type: "mark",
    format: "underline",
    name: "Underline",
    icon: <UnderlineIcon />,
  },
  { type: "mark", format: "code", name: "Code", icon: <Code2Icon /> },
  {
    type: "block",
    format: "heading-one",
    name: "Heading 1",
    icon: <Heading1Icon />,
  },
  {
    type: "block",
    format: "heading-two",
    name: "Heading 2",
    icon: <Heading2Icon />,
  },
  {
    type: "block",
    format: "block-quote",
    name: "Block Quote",
    icon: <QuoteIcon className="!size-3 fill-foreground" />,
  },
  {
    type: "block",
    format: "numbered-list",
    name: "Numbered List",
    icon: <ListOrderedIcon />,
  },
  {
    type: "block",
    format: "bulleted-list",
    name: "Bulleted List",
    icon: <ListIcon />,
  },
];

interface RichTextEditorProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  allowedFormats?: RichTextFormat[];
  initialValue?: Descendant[];
  autoFocus?: boolean;
  onValueChange?: (value: Descendant[]) => void;
}

export default function RichTextEditor({
  allowedFormats = allRichTextFormats,
  initialValue = [{ type: "paragraph", children: [{ text: "" }] }],
  autoFocus,
  onValueChange,
  spellCheck,
  className,
  placeholder,
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
      if (isHotkey(hotkey, event) && allowedFormats.includes(HOTKEYS[hotkey])) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
        return;
      }
    }

    if (event.key === "Tab") {
      event.preventDefault();
      Editor.insertText(editor, "\t");
    }
  };

  const filteredFormatOptions = useMemo(() => {
    return formatOptions.filter(({ format }) =>
      allowedFormats.includes(format),
    );
  }, [allowedFormats]);

  return (
    <TooltipProvider>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={onValueChange}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5">
            <div className="flex items-center">
              <RichTextEditorUndoButton />
              <RichTextEditorRedoButton />
            </div>
            <ButtonSeparator />
            {filteredFormatOptions.map(
              ({ type, format, icon, name }, index) => (
                <React.Fragment key={format}>
                  {index !== 0 && <ButtonSeparator />}

                  {type === "mark" ? (
                    <RichTextEditorMarkButton
                      format={format as RichTextMarkFormat}
                      icon={icon}
                      name={name}
                    />
                  ) : (
                    <RichTextEditorBlockButton
                      format={format as RichTextBlockFormat}
                      icon={icon}
                      name={name}
                    />
                  )}
                </React.Fragment>
              ),
            )}
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
    </TooltipProvider>
  );
}

const ButtonSeparator = () => (
  <Separator orientation="vertical" className="h-6" />
);

const Element: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
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
