import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type AnchorProps = ComponentPropsWithoutRef<"a">;

const components = {
  h1: (props: HeadingProps) => (
    <h1 className="my-6 text-4xl font-bold text-uci-blue" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="mb-2 mt-4 text-2xl font-bold text-uci-blue" {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p className="mb-6 text-lg text-foreground" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    return (
      <Link
        href={href!}
        className={cn("text-nowrap text-link hover:underline", props.className)}
        target={href?.startsWith("/") ? "_self" : "_blank"}
        {...props}
      >
        {children}
      </Link>
    );
  },
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
