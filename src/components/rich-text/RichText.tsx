import escapeHtml from "escape-html";
import { Text } from "slate";

export type RichTextMarkFormat = "bold" | "italic" | "underline" | "code";
export type RichTextBlockFormat =
  | "block-quote"
  | "heading-one"
  | "heading-two"
  | "list-item"
  | "bulleted-list"
  | "numbered-list";

export type RichTextFormat = RichTextMarkFormat | RichTextBlockFormat;

export const allRichTextFormats: RichTextFormat[] = [
  "bold",
  "italic",
  "underline",
  "code",
  "block-quote",
  "heading-one",
  "heading-two",
  "list-item",
  "bulleted-list",
  "numbered-list",
];

export type LeafFormat = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type ParagraphElement = { type: "paragraph"; children: LeafFormat[] };
type HeadingOneElement = { type: "heading-one"; children: LeafFormat[] };
type HeadingTwoElement = { type: "heading-two"; children: LeafFormat[] };
type BlockQuoteElement = { type: "block-quote"; children: LeafFormat[] };
type BulletedListElement = { type: "bulleted-list"; children: LeafFormat[] };
type NumberedListElement = { type: "numbered-list"; children: LeafFormat[] };
type ListItemElement = { type: "list-item"; children: LeafFormat[] };

export type ElementFormat =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement;

export function serialize(node: LeafFormat | ElementFormat) {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      return <strong>${string}</strong>;
    }
    return string;
  }

  const children = node.children.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "block-quote":
      return <blockquote>{children}</blockquote>;
    case "heading-one":
      return <h1>{children}</h1>;
    case "heading-two":
      return <h2>{children}</h2>;
    case "bulleted-list":
      return <ul>{children}</ul>;
    case "list-item":
      return <li>{children}</li>;
    case "numbered-list":
      return <ol>{children}</ol>;
    default:
      return <p>{children}</p>;
  }
}
