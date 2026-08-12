"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// The .dark class on <html> is the single source of truth: the blocking
// init script sets it before hydration, and toggleTheme keeps it in sync.
function readTheme(): Theme {
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function subscribeToTheme(callback: () => void) {
  const classObserver = new MutationObserver(callback);
  classObserver.observe(document.documentElement, {
    attributeFilter: ["class"],
  });

  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    // An explicit user choice always wins over a system change.
    if (localStorage.getItem(STORAGE_KEY)) return;
    document.documentElement.classList.toggle(
      "dark",
      systemThemeQuery.matches,
    );
  };
  systemThemeQuery.addEventListener("change", handleSystemChange);

  return () => {
    classObserver.disconnect();
    systemThemeQuery.removeEventListener("change", handleSystemChange);
  };
}

const noopSubscribe = () => () => {};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    readTheme,
    () => "light",
  );
  // Server and first client render must match, so anything that depends
  // on client-only state (like which icon to show) waits for this.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
