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
  stats.innerHTML = `
    <div class="stats-grid">
      <div class="labelled-output">
        <span class="labelled-output-label">Avg mph</span>
        <output class="labelled-output-value">${formatMetric(current.avgSpeed)}</output>
      </div>
      <div class="labelled-output">
        <span class="labelled-output-label">Median pace</span>
        <output class="labelled-output-value">${formatMetric(current.medianPace)}</output>
      </div>
    </div>
  `;
}

function renderWalks() {
  if (!walksList) return;

  const walks = provider.getAllWalks();
  const countLabel = `${walks.length} ${walks.length === 1 ? "walk" : "walks"}`;

  if (walks.length === 0) {
    walksList.innerHTML = `
      <div class="walks-history">
        <div class="table-header">
          <h2 id="history-heading" class="section-title">Walk history</h2>
          <span class="chip history-count">0 walks</span>
        </div>
        <p class="empty-state">No walks recorded yet. Add your first walk above!</p>
      </div>
    `;
    return;
  }

  walksList.innerHTML = `
    <div class="walks-history">
      <div class="table-header">
        <h2 id="history-heading" class="section-title">Walk history</h2>
        <div class="static-demo-actions">
          <span class="chip history-count">${countLabel}</span>
          <button class="button clear-walks-btn" type="button" data-size="compact" data-variant="danger" data-clear-walks>
            Clear all
          </button>
        </div>
      </div>
        <div
        class="scrollable-table-container"
        ${walks.length > 3 ? 'data-scrollable="true"' : ""}
        style="--scrollable-table-columns: ${tableColumnsTemplate}; --scrollable-table-mobile-columns: ${tableMobileColumnsTemplate}; --scrollable-table-row-height: ${WALK_HISTORY_ROW_HEIGHT}; --scrollable-table-mobile-row-height: ${WALK_HISTORY_MOBILE_ROW_HEIGHT}; --scrollable-table-scroll-body-rows: 4; --scrollable-table-mobile-scroll-body-rows: 3"
      >
        <table class="scrollable-table walks-table">
          <thead>
            <tr class="scrollable-table-row walks-row">
            <th scope="col">Date</th>
            <th scope="col">Mi</th>
            <th scope="col">Min</th>
            <th scope="col">Sec</th>
            <th scope="col">Mph</th>
            <th scope="col">Pace</th>
            <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody ${walks.length > 3 ? 'tabindex="0"' : ""}>
            ${walks.map(renderWalkRow).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderWalkRow(walk: WalkWithStats) {
  return `
    <tr class="scrollable-table-row walks-row">
      <td class="walks-cell"><time class="walk-created-at" datetime="${escapeAttribute(walk.created_at)}">${formatDate(walk.created_at)}</time></td>
      <td class="table-cell walks-cell">${walk.miles.toFixed(1)}</td>
      <td class="table-cell walks-cell">${walk.minutes}</td>
      <td class="table-cell walks-cell">${walk.seconds}</td>
      <td class="table-cell walks-cell">${formatMetric(walk.speed)}</td>
      <td class="table-cell walks-cell">${formatMetric(walk.pace)}</td>
      <td class="walks-cell">
        <button class="button clear-walk-btn" type="button" data-size="compact" data-variant="danger" data-delete-walk="${walk.id}">
          Clear
        </button>
      </td>
    </tr>
  `;
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
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function escapeAttribute(value: string) {
  return value.replaceAll('"', "&quot;");
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
