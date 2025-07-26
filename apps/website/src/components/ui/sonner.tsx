"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      richColors
      theme={theme as ToasterProps["theme"]}
      className="group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--positive)",
          "--success-text": "var(--positive-foreground)",
          "--success-border": "var(--border)",
        } as CSSProperties
      }
      closeButton
      toastOptions={{
        classNames: {
          title: "text-base",
          closeButton: "hover:!bg-muted hover:!text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
