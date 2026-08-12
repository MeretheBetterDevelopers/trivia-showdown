"use client";

import { copy } from "@/src/lib/constants/copy";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={copy.themeToggle.ariaLabel}
      className="border border-border rounded-lg px-3 py-2 text-sm font-medium"
    >
      {mounted
        ? theme === "dark"
          ? copy.themeToggle.lightLabel
          : copy.themeToggle.darkLabel
        : " "}
    </button>
  );
}
