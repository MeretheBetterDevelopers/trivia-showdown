// Runs before hydration so the correct theme is on screen from the first
// paint instead of flashing light before switching to dark (or back).
export const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "dark" || (stored !== "light" && systemPrefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();`;
