import escapeHtml from "escape-html";
import React from "react";
import ReactDOMServer from "react-dom/server";
import type { BaseEditor } from "slate";
import { Node, Text } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

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

export type LeafNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type ParagraphElement = { type: "paragraph"; children: LeafNode[] };
type HeadingOneElement = { type: "heading-one"; children: LeafNode[] };
type HeadingTwoElement = { type: "heading-two"; children: LeafNode[] };
type BlockQuoteElement = { type: "block-quote"; children: LeafNode[] };
type BulletedListElement = { type: "bulleted-list"; children: LeafNode[] };
type NumberedListElement = { type: "numbered-list"; children: LeafNode[] };
type ListItemElement = { type: "list-item"; children: LeafNode[] };

export type ElementNode =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: ElementNode;
    Text: LeafNode;
  }
}

export function serializeLeaf(leaf: LeafNode) {
  let children: React.ReactNode | string = escapeHtml(leaf.text);

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

  return <span key={0}>{children}</span>;
}

export function serializeElement(element: ElementNode) {
  const children = element.children.map((n) => serializeNode(n));

  console.log(children);

  switch (element.type) {
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

export function serializeNode(node: LeafNode | ElementNode) {
  if (Text.isText(node)) {
    return serializeLeaf(node);
  }

  return serializeElement(node);
}

export function serialize(nodes: (LeafNode | ElementNode)[]) {
  return nodes
    .map((n) => serializeNode(n))
    .map((n) => ReactDOMServer.renderToStaticMarkup(n))
    .join("");
}

export function serializeText(nodes: (LeafNode | ElementNode)[]) {
  return nodes.map((n) => Node.string(n)).join("\n");
}
