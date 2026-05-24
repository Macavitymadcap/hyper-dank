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
  initialiseDocsSearch();
  closeMobileSideNavs();
  closeMobileSideNavsAfterNavigation();
  window.hljs?.highlightAll();
});

function initialiseDocsSearch() {
  const searchRoot = document.querySelector("[data-docs-search]");
  if (!searchRoot) return;

  const form = searchRoot.querySelector("[data-docs-search-form]");
  const input = searchRoot.querySelector("[data-docs-search-input]");
  const results = searchRoot.querySelector("[data-docs-search-results]");
  const status = searchRoot.querySelector("[data-docs-search-status]");
  const searchIndexUrl = searchRoot.getAttribute("data-search-index");
  if (!(input instanceof HTMLInputElement) || !results || !status || !searchIndexUrl) return;

  const initialQuery = new URLSearchParams(window.location.search).get("q");
  if (initialQuery) input.value = initialQuery;

  let entries = [];
  const setStatus = (message) => {
    status.textContent = message;
  };

  fetch(searchIndexUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Search index failed with ${response.status}`);
      return response.json();
    })
    .then((index) => {
      entries = Array.isArray(index.entries) ? index.entries : [];
      renderDocsSearchResults(input.value, entries, results, setStatus);
    })
    .catch(() => {
      setStatus("Search is unavailable. Use the reference paths below.");
    });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSearchQuery(input.value);
    renderDocsSearchResults(input.value, entries, results, setStatus);
  });

  input.addEventListener("input", () => {
    renderDocsSearchResults(input.value, entries, results, setStatus);
  });
}

function renderDocsSearchResults(query, entries, results, setStatus) {
  const terms = normaliseSearchValue(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  results.replaceChildren();

  if (terms.length === 0) {
    setStatus("Search index ready.");
    return;
  }

  const matches = entries
    .map((entry) => ({ entry, score: docsSearchScore(entry, terms) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 12);

  if (matches.length === 0) {
    setStatus(`No results for "${query.trim()}".`);
    return;
  }

  setStatus(`${matches.length} result${matches.length === 1 ? "" : "s"} for "${query.trim()}".`);

  for (const { entry } of matches) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const title = document.createElement("strong");
    const meta = document.createElement("span");

    link.className = "docs-search__result";
    link.href = entry.url;
    title.textContent = entry.title;
    meta.textContent = searchResultSummary(entry);
    link.append(title, meta);
    item.append(link);
    results.append(item);
  }
}

function docsSearchScore(entry, terms) {
  const title = normaliseSearchValue(entry.title);
  const headings = normaliseSearchValue((entry.headings ?? []).join(" "));
  const keywords = normaliseSearchValue((entry.keywords ?? []).join(" "));
  const text = normaliseSearchValue(entry.text);

  return terms.reduce((score, term) => {
    if (keywords.includes(term)) return score + 8;
    if (title.includes(term)) return score + 6;
    if (headings.includes(term)) return score + 4;
    if (text.includes(term)) return score + 1;
    return score;
  }, 0);
}

function normaliseSearchValue(value) {
  const cleaned = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9@/-]+/g, " ");
  return `${cleaned} ${cleaned.replace(/-/g, " ")}`;
}

function searchResultSummary(entry) {
  const headings = Array.isArray(entry.headings) ? entry.headings.slice(0, 2).join(" / ") : "";
  if (headings) return headings;
  return String(entry.url ?? "");
}

function updateSearchQuery(query) {
  const url = new URL(window.location.href);
  const trimmed = query.trim();
  if (trimmed) {
    url.searchParams.set("q", trimmed);
  } else {
    url.searchParams.delete("q");
  }
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

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
  const linksByHeadingId = new Map();
  let currentLink = null;

  for (const heading of headings) {
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent?.trim() ?? heading.id;
    if (heading.tagName.toLowerCase() === "h3") link.classList.add("docs-page-toc__child");
    link.addEventListener("click", () => setCurrentPageTocLink(link));
    linksByHeadingId.set(heading.id, link);
    toc.append(link);
  }

  activeLink.insertAdjacentElement("afterend", toc);
  updateCurrentPageTocLink();

  let scrollFrame = null;
  const scheduleCurrentLinkUpdate = () => {
    if (scrollFrame !== null) return;

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null;
      updateCurrentPageTocLink();
    });
  };

  window.addEventListener("scroll", scheduleCurrentLinkUpdate, { passive: true });
  window.addEventListener("resize", scheduleCurrentLinkUpdate);

  function updateCurrentPageTocLink() {
    const currentHeading = headingNearestTop(headings);
    const link = linksByHeadingId.get(currentHeading.id);
    if (link) setCurrentPageTocLink(link);
  }

  function setCurrentPageTocLink(link) {
    if (currentLink === link) return;

    currentLink?.removeAttribute("aria-current");
    currentLink?.removeAttribute("data-current-section");
    currentLink = link;
    currentLink.setAttribute("aria-current", "location");
    currentLink.dataset.currentSection = "true";
  }
}

function headingNearestTop(headings) {
  const pageOffset = 120;
  let currentHeading = headings[0];

  for (const heading of headings) {
    const headingTop = heading.getBoundingClientRect().top;
    if (headingTop > pageOffset) break;
    currentHeading = heading;
  }

  return currentHeading;
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
