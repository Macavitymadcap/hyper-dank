export const layoutStyles = /* css */`
:root {
  color-scheme: light;
  --theme-duration: 480ms;
  --theme-easing: var(--ease-3);
  --theme-transition: var(--theme-duration) var(--theme-easing);
  --theme-text-transition: 0ms linear;
  --app-bg: var(--gray-1);
  --surface: var(--gray-0);
  --surface-raised: var(--gray-2);
  --text: var(--gray-9);
  --text-muted: var(--gray-7);
  --border-subtle: var(--gray-3);
  --primary: var(--blue-6);
  --primary-strong: var(--blue-7);
  --primary-text: var(--gray-0);
  --button-bg: var(--gray-0);
  --button-bg-hover: var(--gray-2);
  --table-bg: var(--gray-0);
  --table-header-bg: var(--gray-1);
  --table-row-bg: var(--gray-0);
  --table-row-hover-bg: var(--blue-0);
  --table-border: var(--gray-5);
  --table-action-divider: var(--gray-6);
  --table-text: var(--gray-9);
  --danger: var(--red-9);
  --danger-hover: var(--red-10);
  --switch-bg: var(--gray-3);
  --switch-icon-light: var(--yellow-9);
  --switch-icon-dark: var(--gray-6);
  --switch-thumb: var(--gray-0);
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --app-bg: var(--gray-12);
  --surface: var(--gray-10);
  --surface-raised: var(--gray-9);
  --text: var(--gray-1);
  --text-muted: var(--gray-4);
  --border-subtle: var(--gray-7);
  --primary: var(--blue-5);
  --primary-strong: var(--blue-4);
  --primary-text: var(--gray-12);
  --button-bg: var(--gray-9);
  --button-bg-hover: var(--gray-8);
  --table-bg: var(--gray-11);
  --table-header-bg: var(--gray-10);
  --table-row-bg: var(--gray-9);
  --table-row-hover-bg: var(--gray-8);
  --table-border: var(--gray-7);
  --table-action-divider: var(--gray-6);
  --table-text: var(--gray-0);
  --danger: var(--red-9);
  --danger-hover: var(--red-10);
  --switch-bg: var(--gray-8);
  --switch-icon-light: var(--gray-5);
  --switch-icon-dark: var(--gray-0);
  --switch-thumb: var(--gray-12);
}

body {
  box-sizing: border-box;
  font-family: var(--font-sans);
  background-color: var(--app-bg);
  color: var(--text);
  padding: var(--size-4);
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  transition:
    background-color var(--theme-transition),
    color var(--theme-text-transition);
}

.card,
.app-header,
.title,
.section-title,
.stat,
.stat-label,
.stat-value,
.form-section,
.button,
.clear-walk-btn,
.clear-walks-btn,
input[type="number"],
.walks-cell,
.walks-table th,
.walks-table td,
.empty-state {
  transition:
    background-color var(--theme-transition),
    color var(--theme-text-transition),
    border-color var(--theme-transition),
    box-shadow var(--theme-transition);
}

.htmx-indicator {
  opacity: 0;
  transition: opacity var(--speed-2) ease-in;
}

.htmx-request .htmx-indicator {
  opacity: 1;
}
`;
