import { raw } from "hono/html";
import { renderAssetTags } from "./assets";

const themeBootstrap = /* js */ `
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

  document.documentElement.dataset.theme = getPreferredTheme();
})();
`;

export const Layout = ({ children }: { children: unknown }) => {
  const assetTags = typeof document === "undefined" ? renderAssetTags() : [];

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Walking Pace Tracker</title>
        <script>{raw(themeBootstrap)}</script>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0&display=swap"
        />
        {assetTags}
      </head>
      <body>{children}</body>
    </html>
  );
};
