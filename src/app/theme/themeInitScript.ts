// Runs before hydration so the correct theme is on screen from the first
// paint instead of flashing light before switching to dark (or back).
export const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();`;
