export const walksTableStyles = /* css */`
.empty-state {
  text-align: center;
  padding: var(--size-10) var(--size-4);
  color: var(--text-muted);
  font-size: var(--font-size-2);
}

.table-container {
  background: var(--table-bg);
  border: 0;
  border-radius: var(--radius-2);
  overflow: hidden;
  --walks-table-columns: minmax(3.5rem, 0.8fr) minmax(3.5rem, 0.8fr) minmax(3.5rem, 0.8fr) minmax(4rem, 1fr) minmax(5rem, 1fr) minmax(5.5rem, 0.85fr);
}

.walks-table {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.walks-table thead,
.walks-table tbody {
  display: block;
}

.walks-table tbody {
  max-height: clamp(16rem, calc(100vh - 360px), 34rem);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.walks-table th {
  padding: var(--size-2);
  background: var(--table-header-bg);
  text-align: center;
  color: var(--table-text);
  font-weight: var(--font-weight-7);
  font-size: var(--font-size-1);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
  border-bottom: var(--border-size-1) solid var(--table-border);
  border-inline-end: var(--border-size-1) solid var(--table-border);
}

.walks-table td {
  background: var(--table-row-bg);
  border-inline-end: var(--border-size-1) solid var(--table-border);
  border-bottom: var(--border-size-1) solid var(--table-border);
}

.walks-table td:nth-child(5),
.walks-table th:nth-child(5) {
  border-inline-end: 0;
}

.walks-table td:last-child,
.walks-table th:last-child {
  display: grid;
  place-items: center;
  background: var(--table-action-bg);
  border-inline-start: var(--border-size-2) solid var(--table-action-divider);
  border-inline-end: 0;
}

.walks-table tbody tr:last-child td {
  border-bottom: 0;
}

.walks-table tbody tr:hover td {
  background: var(--table-row-hover-bg);
}

.walks-table tbody tr:hover td:last-child {
  background: var(--table-action-hover-bg);
}

.clear-walks-btn {
  padding: var(--size-1) var(--size-2);
  background: transparent;
  border: var(--border-size-1) solid var(--table-border);
  color: var(--table-text);
  font-size: var(--font-size-0);
  line-height: 1;
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
}

.clear-walks-btn:hover {
  background: var(--table-row-hover-bg);
}
`;
