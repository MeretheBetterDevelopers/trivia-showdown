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

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" || attr === "light" ? attr : getSystemTheme();
}

// Subscribe to changes in the theme, either from the system or from localStorage. Called when the component mounts and whenever the theme changes. Returns a function to unsubscribe.
function subscribeToTheme(callback: () => void) {
  const attributeObserver = new MutationObserver(callback);
  attributeObserver.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });

  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemThemeQuery.addEventListener("change", callback);

  return () => {
    attributeObserver.disconnect();
    systemThemeQuery.removeEventListener("change", callback);
  };
}

// A no-op subscribe function for useSyncExternalStore that does nothing. This is used for the mounted state, which doesn't need to subscribe to any external store.
const noopSubscribe = () => () => {};

// ThemeProvider component that provides the current theme and a function to toggle the theme to its children. It uses useSyncExternalStore to subscribe to changes in the theme and to read the current theme from the document's data-theme attribute.
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
    document.documentElement.setAttribute("data-theme", next);
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
