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
  buildCurrentPageNavigation();
  closeMobileSideNavs();
  closeMobileSideNavsAfterNavigation();
  window.hljs?.highlightAll();
});

function buildCurrentPageNavigation() {
  const page = document.querySelector(".docs-page, .library-page");
  if (!page) return;

  const activeLink = document.querySelector(".docs-side-nav a[aria-current='page']");
  if (!activeLink) return;

  const headings = Array.from(page.querySelectorAll("h2[id], h3[id]")).filter((heading) => {
    return heading.textContent?.trim() && !heading.closest(".docs-page-toc");
  });
  if (headings.length === 0) return;

  const toc = document.createElement("nav");
  toc.className = "docs-page-toc";
  toc.setAttribute("aria-label", "Current page sections");

  for (const heading of headings) {
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent?.trim() ?? heading.id;
    if (heading.tagName.toLowerCase() === "h3") link.classList.add("docs-page-toc__child");
    toc.append(link);
  }

  activeLink.insertAdjacentElement("afterend", toc);
}

function closeMobileSideNavs() {
  if (!window.matchMedia("(max-width: 640px)").matches) return;

  document.querySelectorAll(".docs-side-nav[open]").forEach((nav) => {
    nav.removeAttribute("open");
  });
}

function closeMobileSideNavsAfterNavigation() {
  document.querySelectorAll(".docs-side-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!window.matchMedia("(max-width: 640px)").matches) return;

      link.closest(".docs-side-nav")?.removeAttribute("open");
    });
  });
}
