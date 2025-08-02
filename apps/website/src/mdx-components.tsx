import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/util/cn";

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-blue my-6 text-3xl font-bold" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-blue mt-4 mb-2 text-2xl font-bold" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-foreground mb-6 text-lg" {...props} />
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (!href) {
      return <a>{children}</a>;
    }

    return (
      <Link
        href={href}
        className={cn("text-link text-nowrap hover:underline", props.className)}
        target={href.startsWith("http") ? "_blank" : undefined}
        {...props}
      >
        {children}
      </Link>
    );
  },
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-inside list-decimal space-y-4 py-2 text-lg" {...props} />
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
