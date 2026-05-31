import "@macavitymadcap/hyper-dank-ui/styles.css";
import "../client/styles.css";
import "./styles.css";
import type { WalkWithStats } from "../db";
import {
  buildWalkHistoryColumnsTemplate,
  buildWalkHistoryMobileColumnsTemplate,
  WALK_HISTORY_MOBILE_ROW_HEIGHT,
  WALK_HISTORY_ROW_HEIGHT,
} from "../shared/walk-history-table";
import { DEMO_STORAGE_KEY, LocalStoragePaceProvider } from "./storage";

const THEME_STORAGE_KEY = "hyper-dank:theme";

const provider = new LocalStoragePaceProvider({ storage: window.localStorage });

const tableColumnsTemplate = buildWalkHistoryColumnsTemplate();
const tableMobileColumnsTemplate = buildWalkHistoryMobileColumnsTemplate();

const form = document.querySelector<HTMLFormElement>("#walk-form");
const error = document.querySelector<HTMLElement>("#form-error");
const stats = document.querySelector<HTMLElement>("#stats");
const walksList = document.querySelector<HTMLElement>("#walks-list");
const themeToggle = document.querySelector<HTMLInputElement>("[data-theme-toggle]");

syncThemeToggle();
render();

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const result = provider.addWalk({
    miles: formData.get("miles"),
    minutes: formData.get("minutes"),
    seconds: formData.get("seconds"),
  });
  if (!result.ok) {
    showError(result.message);
    return;
  }

  hideError();
  form.reset();
  render();
});

walksList?.addEventListener("click", (event) => {
  const button = (event.target as Element | null)?.closest("[data-delete-walk]");
  if (!(button instanceof HTMLButtonElement)) return;

  provider.deleteWalk(Number(button.dataset.deleteWalk));
  render();
});

walksList?.addEventListener("click", (event) => {
  const button = (event.target as Element | null)?.closest("[data-clear-walks]");
  if (!(button instanceof HTMLButtonElement)) return;

  provider.clearWalks();
  render();
});

themeToggle?.addEventListener("change", () => {
  applyTheme(themeToggle.checked ? "dark" : "light");
});

function render() {
  renderStats();
  renderWalks();
}

function renderStats() {
  if (!stats) return;

  const current = provider.getStats();
  const grid = createElement("div", { className: "stats-grid" });
  grid.append(
    renderLabelledOutput("Avg mph", formatMetric(current.avgSpeed)),
    renderLabelledOutput("Median pace", formatMetric(current.medianPace)),
  );

  stats.replaceChildren(grid);
}

function renderWalks() {
  if (!walksList) return;

  const walks = provider.getAllWalks();
  const countLabel = `${walks.length} ${walks.length === 1 ? "walk" : "walks"}`;
  const history = createElement("div", { className: "walks-history" });
  history.append(renderHistoryHeader(countLabel, walks.length > 0));

  if (walks.length === 0) {
    history.append(
      createElement("p", {
        className: "empty-state",
        text: "No walks recorded yet. Add your first walk above!",
      }),
    );
    walksList.replaceChildren(history);
    return;
  }

  history.append(renderWalksTable(walks));
  walksList.replaceChildren(history);
}

function renderLabelledOutput(label: string, value: string) {
  const wrapper = createElement("div", { className: "labelled-output" });
  wrapper.append(
    createElement("span", { className: "labelled-output-label", text: label }),
    createElement("output", { className: "labelled-output-value", text: value }),
  );

  return wrapper;
}

function renderHistoryHeader(countLabel: string, canClear: boolean) {
  const header = createElement("div", { className: "table-header" });
  const heading = createElement("h2", {
    className: "section-title",
    text: "Walk history",
  });
  heading.id = "history-heading";

  if (!canClear) {
    header.append(
      heading,
      createElement("span", { className: "chip history-count", text: countLabel }),
    );
    return header;
  }

  const actions = createElement("div", { className: "static-demo-actions" });
  const clearButton = createElement("button", {
    className: "button clear-walks-btn",
    text: "Clear all",
  });
  clearButton.type = "button";
  clearButton.dataset.clearWalks = "";
  clearButton.dataset.size = "compact";
  clearButton.dataset.variant = "danger";
  actions.append(
    createElement("span", { className: "chip history-count", text: countLabel }),
    clearButton,
  );
  header.append(heading, actions);

  return header;
}

function renderWalksTable(walks: WalkWithStats[]) {
  const container = createElement("div", { className: "scrollable-table-container" });
  container.style.setProperty("--scrollable-table-columns", tableColumnsTemplate);
  container.style.setProperty("--scrollable-table-mobile-columns", tableMobileColumnsTemplate);
  container.style.setProperty("--scrollable-table-row-height", WALK_HISTORY_ROW_HEIGHT);
  container.style.setProperty(
    "--scrollable-table-mobile-row-height",
    WALK_HISTORY_MOBILE_ROW_HEIGHT,
  );
  container.style.setProperty("--scrollable-table-scroll-body-rows", "4");
  container.style.setProperty("--scrollable-table-mobile-scroll-body-rows", "3");
  if (walks.length > 3) container.dataset.scrollable = "true";

  const table = createElement("table", { className: "scrollable-table walks-table" });
  const thead = document.createElement("thead");
  const headerRow = createElement("tr", { className: "scrollable-table-row walks-row" });
  for (const label of ["Date", "Mi", "Min", "Sec", "Mph", "Pace", "Action"]) {
    const header = createElement("th", { text: label });
    header.scope = "col";
    headerRow.append(header);
  }
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  if (walks.length > 3) tbody.tabIndex = 0;
  tbody.append(...walks.map(renderWalkRow));

  table.append(thead, tbody);
  container.append(table);

  return container;
}

function renderWalkRow(walk: WalkWithStats) {
  const row = createElement("tr", { className: "scrollable-table-row walks-row" });
  const dateCell = createElement("td", { className: "walks-cell" });
  const time = createElement("time", {
    className: "walk-created-at",
    text: formatDate(walk.created_at),
  });
  time.dateTime = walk.created_at;
  dateCell.append(time);

  row.append(
    dateCell,
    tableCell(walk.miles.toFixed(1)),
    tableCell(String(walk.minutes)),
    tableCell(String(walk.seconds)),
    tableCell(formatMetric(walk.speed)),
    tableCell(formatMetric(walk.pace)),
    actionCell(walk.id),
  );

  return row;
}

function tableCell(text: string) {
  return createElement("td", { className: "table-cell walks-cell", text });
}

function actionCell(id: number) {
  const cell = createElement("td", { className: "walks-cell" });
  const button = createElement("button", {
    className: "button clear-walk-btn",
    text: "Clear",
  });
  button.type = "button";
  button.dataset.deleteWalk = String(id);
  button.dataset.size = "compact";
  button.dataset.variant = "danger";
  cell.append(button);

  return cell;
}

function showError(message: string) {
  if (!error) return;

  error.hidden = false;
  error.textContent = message;
}

function hideError() {
  if (!error) return;

  error.hidden = true;
  error.textContent = "";
}

function formatMetric(value: number | undefined) {
  return value && value > 0 ? value.toFixed(1) : "--";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function syncThemeToggle() {
  const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  if (!themeToggle) return;

  themeToggle.checked = theme === "dark";
  themeToggle.setAttribute("aria-checked", String(theme === "dark"));
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-checked", String(theme === "dark"));

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

window.addEventListener("storage", (event) => {
  if (event.key === DEMO_STORAGE_KEY) render();
});

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: { className?: string; text?: string } = {},
) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;

  return element;
}
