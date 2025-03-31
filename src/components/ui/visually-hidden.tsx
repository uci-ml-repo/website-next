"use client";

import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";

interface Props {
  children: React.ReactNode;
}

export function VisuallyHidden({ children }: Props) {
  return <VisuallyHiddenPrimitive.Root>{children}</VisuallyHiddenPrimitive.Root>;
}
