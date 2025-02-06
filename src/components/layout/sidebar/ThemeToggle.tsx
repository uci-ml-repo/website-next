import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function changeTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <div className="flex items-center space-x-1.5 [&>svg]:size-4">
      <Switch
        onCheckedChange={changeTheme}
        checked={theme === "dark"}
        className="!bg-muted-foreground"
        aria-label="Toggle theme"
      />
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </div>
  );
}
