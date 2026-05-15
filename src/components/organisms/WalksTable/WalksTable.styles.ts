export const walksTableStyles = /* css */`
.empty-state {
  text-align: center;
  padding: var(--size-10) var(--size-4);
  color: var(--text-muted);
  font-size: var(--font-size-2);
}

.table-container {
  background-color: transparent;
  border: 0;
  outline: 0;
  overflow: visible;
  display: flex;
  flex: 1;
  align-items: flex-start;
  min-height: 0;
  width: 100%;
  --walks-table-columns: minmax(3.5rem, 0.8fr) minmax(3.5rem, 0.8fr) minmax(3.5rem, 0.8fr) minmax(4rem, 1fr) minmax(5rem, 1fr) minmax(5.5rem, 0.85fr);
  --walks-row-height: 3rem;
}

.walks-table {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  height: max-content;
  max-height: 100%;
  background-color: transparent;
  border: var(--border-size-1) solid var(--table-border);
  border-radius: var(--radius-2);
  outline: 0;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

.walks-table thead,
.walks-table tbody {
  display: block;
}

.walks-table tbody {
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.walks-table tbody .walks-row {
  min-height: var(--walks-row-height);
}

.walks-table th {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  height: 3.5rem;
  padding: var(--size-2);
  background-color: var(--table-header-bg);
  text-align: center;
  color: var(--table-text);
  font-weight: var(--font-weight-7);
  font-size: var(--font-size-1);
  line-height: var(--font-lineheight-0);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
  border-bottom: var(--border-size-1) solid var(--table-border);
  border-inline-end: var(--border-size-1) solid var(--table-border);
}

.walks-table td {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  min-height: var(--walks-row-height);
  background-color: var(--table-row-bg);
  border-inline-end: var(--border-size-1) solid var(--table-border);
  border-bottom: var(--border-size-1) solid var(--table-border);
}

.walks-table td:nth-child(5),
.walks-table th:nth-child(5) {
  border-inline-end: 0;
}

.walks-table td:last-child,
.walks-table th:last-child {
  border-inline-start: var(--border-size-2) solid var(--table-action-divider);
  border-inline-end: 0;
}

.walks-table th:last-child {
  background-color: var(--table-header-bg);
}

.walks-table td:last-child {
  background-color: var(--table-row-bg);
}

.walks-table tbody .walks-row:last-child > td {
  border-bottom: 0;
}

.walks-table tbody tr:hover td {
  background-color: var(--table-row-hover-bg);
}

.clear-walks-btn {
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  height: 2rem;
  min-block-size: 0;
  padding: 0 var(--size-2);
  background-color: transparent;
  border: var(--border-size-1) solid var(--table-border);
  color: var(--table-text);
  font-size: var(--font-size-0);
  line-height: var(--font-lineheight-0);
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
}

.clear-walks-btn:hover {
  background-color: var(--table-row-hover-bg);
}
`;
