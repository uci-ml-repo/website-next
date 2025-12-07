"use client";

import { useMounted } from "@mantine/hooks";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const mounted = useMounted();
  const { setTheme } = useTheme();
  const { resolvedTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fade-in animate-in flex items-center space-x-1.5 [&>svg]:size-4">
      <Switch
        onCheckedChange={() => setTheme(isDark ? "light" : "dark")}
        checked={isDark}
        className="!bg-muted-foreground"
        aria-label="Toggle theme"
      />
      {isDark ? <MoonIcon /> : <SunIcon />}
    </div>
  );
}
