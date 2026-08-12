"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="border border-border rounded-lg px-3 py-2 text-sm font-medium"
    >
      {mounted ? (theme === "dark" ? "☀️ Light" : "🌙 Dark") : " "}
    </button>
  );
}
