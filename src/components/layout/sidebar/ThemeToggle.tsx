"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function changeTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={changeTheme}
      className="relative [&>svg]:absolute [&>svg]:size-4"
    >
      <SunIcon className="scale-100 dark:scale-0" />
      <MoonIcon className="scale-0 dark:scale-100" />
    </Button>
  );
}
