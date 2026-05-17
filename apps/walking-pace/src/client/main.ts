import htmx from "htmx.org";
import "./styles.css";

declare global {
  interface Window {
    htmx: typeof htmx;
  }
}

window.htmx = htmx;

const storageKey = "pace-calculator-theme";

const isTheme = (value: string | null | undefined): value is "light" | "dark" => {
  return value === "light" || value === "dark";
};

const getStoredTheme = () => {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

const storeTheme = (theme: "light" | "dark") => {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {}
};

const getPreferredTheme = (): "light" | "dark" => {
  const currentTheme = document.documentElement.dataset.theme;
  if (isTheme(currentTheme)) return currentTheme;

  const stored = getStoredTheme();
  if (isTheme(stored)) return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const syncToggle = (theme: "light" | "dark") => {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!(toggle instanceof HTMLInputElement)) return;

  const isDark = theme === "dark";
  toggle.checked = isDark;
  toggle.setAttribute("aria-checked", String(isDark));
};

const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.dataset.theme = theme;
  syncToggle(theme);
};

applyTheme(getPreferredTheme());

window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("[data-theme-toggle]");
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (!(toggle instanceof HTMLInputElement)) return;

  toggle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
  });

  toggle.addEventListener("change", () => {
    const nextTheme = toggle.checked ? "dark" : "light";
    storeTheme(nextTheme);
    applyTheme(nextTheme);
  });
});
