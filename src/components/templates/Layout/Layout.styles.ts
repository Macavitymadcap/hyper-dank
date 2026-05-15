export const layoutStyles = /* css */`
:root {
  color-scheme: light;
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
  --table-border: var(--gray-3);
  --table-action-bg: var(--gray-1);
  --table-action-hover-bg: var(--gray-2);
  --table-action-divider: var(--gray-4);
  --table-text: var(--gray-9);
  --danger: var(--red-6);
  --danger-hover: var(--red-7);
  --switch-bg: var(--gray-3);
  --switch-icon: var(--gray-7);
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
  --table-action-bg: var(--gray-10);
  --table-action-hover-bg: var(--gray-8);
  --table-action-divider: var(--gray-6);
  --table-text: var(--gray-0);
  --danger: var(--red-7);
  --danger-hover: var(--red-6);
  --switch-bg: var(--gray-8);
  --switch-icon: var(--gray-1);
  --switch-thumb: var(--gray-12);
}

body {
  font-family: var(--font-sans);
  background: var(--app-bg);
  color: var(--text);
  padding: var(--size-4);
  max-width: 600px;
  margin: 0 auto;
}

.htmx-indicator {
  opacity: 0;
  transition: opacity var(--speed-2) ease-in;
}

.htmx-request .htmx-indicator {
  opacity: 1;
}
`;
