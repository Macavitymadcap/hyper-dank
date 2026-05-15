import { raw } from "hono/html";
import { appStyles } from "../styles";

const themeScript = /* js */`
(() => {
  const storageKey = "pace-calculator-theme";

  const getStoredTheme = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
    }
  };

  const getPreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const syncToggle = (theme) => {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    const isDark = theme === "dark";
    toggle.checked = isDark;
    toggle.setAttribute("aria-checked", String(isDark));
  };

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    syncToggle(theme);
  };

  applyTheme(getPreferredTheme());

  window.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-theme-toggle]");
    const currentTheme = document.documentElement.dataset.theme || getPreferredTheme();
    syncToggle(currentTheme);

    toggle?.addEventListener("change", () => {
      const nextTheme = toggle.checked ? "dark" : "light";
      storeTheme(nextTheme);
      applyTheme(nextTheme);
    });
  });
})();
`;

export const Layout = ({ children }: { children: unknown }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Walking Pace Tracker</title>
        <script>{raw(themeScript)}</script>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0" />
        <link rel="stylesheet" href="https://unpkg.com/open-props" />
        <link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css" />
        <style>{raw(appStyles)}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};
