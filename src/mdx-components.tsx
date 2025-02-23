import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="my-6 text-3xl font-bold text-uci-blue" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mb-2 mt-4 text-2xl font-bold text-uci-blue" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-6 text-lg text-foreground" {...props} />
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (!href) {
      return <a>{children}</a>;
    }

    return (
      <Link
        href={href}
        className={cn("text-nowrap text-link hover:underline", props.className)}
        target={href.startsWith("http") ? "_blank" : undefined}
        {...props}
      >
        {children}
      </Link>
    );
  },
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-inside list-decimal space-y-4 py-2 text-lg"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-inside list-disc space-y-4 py-2 text-lg" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold" {...props} />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
