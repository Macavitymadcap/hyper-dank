const themeStorageKey = "hyper-dank-docs-theme";
const themeToggle = document.querySelector("[data-theme-toggle]");
const highlightLight = document.querySelector("#highlight-theme-light");
const highlightDark = document.querySelector("#highlight-theme-dark");

function preferredTheme() {
  const stored = readStoredTheme();
  if (stored === "dark" || stored === "light") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme, { persist = false } = {}) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  if (themeToggle instanceof HTMLInputElement) {
    const isDark = theme === "dark";
    themeToggle.checked = isDark;
    themeToggle.setAttribute("aria-checked", String(isDark));
  }

  if (highlightLight instanceof HTMLLinkElement) {
    highlightLight.disabled = theme === "dark";
  }

  if (highlightDark instanceof HTMLLinkElement) {
    highlightDark.disabled = theme !== "dark";
  }

  if (persist) {
    writeStoredTheme(theme);
  }
}

function readStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

function writeStoredTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {}
}

applyTheme(preferredTheme());

themeToggle?.addEventListener("change", () => {
  if (!(themeToggle instanceof HTMLInputElement)) return;
  applyTheme(themeToggle.checked ? "dark" : "light", { persist: true });
});

document.addEventListener("DOMContentLoaded", () => {
  window.hljs?.highlightAll();
});
