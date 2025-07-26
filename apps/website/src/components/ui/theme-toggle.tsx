"use client";

import { Switch } from "@components/ui/switch";
import { cn } from "@lib/utils/cn";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";
  return (
    <div className={cn("flex items-center space-x-1.5 [&>svg]:size-4", "fade-in animate-in")}>
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
