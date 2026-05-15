export const walksTableStyles = /* css */`
.empty-state {
  text-align: center;
  padding: var(--size-10) var(--size-4);
  color: var(--text-muted);
  font-size: var(--font-size-2);
}

.walks-history {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--size-3);
  min-height: 0;
  width: 100%;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-3);
}

.history-count {
  display: inline-grid;
  place-items: center;
  min-height: 1.75rem;
  padding: 0 var(--size-2);
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-round);
  color: var(--text-muted);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-0);
  white-space: nowrap;
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
  --walks-table-columns: minmax(4.5rem, 0.9fr) minmax(3.5rem, 0.7fr) minmax(3.5rem, 0.7fr) minmax(3.5rem, 0.7fr) minmax(4rem, 0.85fr) minmax(5rem, 1fr) minmax(5.5rem, 0.9fr);
  --walks-row-height: 3rem;
  --walks-table-inner-radius: calc(var(--radius-2) - var(--border-size-1));
}

.walks-table {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  height: 100%;
  max-height: 100%;
  background-color: var(--table-row-bg);
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
  background-color: var(--table-row-bg);
  border-end-start-radius: var(--walks-table-inner-radius);
  border-end-end-radius: var(--walks-table-inner-radius);
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

.walks-table td:nth-child(6),
.walks-table th:nth-child(6) {
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

.walks-table tbody .walks-row:last-child > td:first-child {
  border-end-start-radius: var(--walks-table-inner-radius);
}

.walks-table tbody .walks-row:last-child > td:last-child {
  border-end-end-radius: var(--walks-table-inner-radius);
}

.walks-table tbody tr:hover td {
  background-color: var(--table-row-hover-bg);
}

@media (max-width: 480px) {
  .walks-history {
    gap: var(--size-2);
  }

  .history-count {
    min-height: 1.5rem;
    padding: 0 var(--size-1);
    font-size: var(--font-size-00);
  }

  .table-container {
    --walks-table-columns: minmax(3.3rem, 0.95fr) minmax(2.1rem, 0.58fr) minmax(2.35rem, 0.62fr) minmax(2.35rem, 0.62fr) minmax(2.6rem, 0.72fr) minmax(3.25rem, 0.85fr) minmax(3.75rem, 0.95fr);
    --walks-row-height: 2.5rem;
  }

  .walks-table th {
    height: 2.75rem;
    padding: var(--size-1);
    font-size: var(--font-size-0);
    letter-spacing: var(--font-letterspacing-1);
  }

  .walks-table {
    height: max-content;
    max-height: none;
  }

  .table-container[data-scrollable="true"] .walks-table {
    height: calc(2.75rem + (2.65 * var(--walks-row-height)));
    max-height: calc(2.75rem + (2.65 * var(--walks-row-height)));
  }

  .walks-table tbody .walks-row {
    height: var(--walks-row-height);
  }

  .walks-table td {
    height: var(--walks-row-height);
    min-height: 0;
    font-size: var(--font-size-0);
  }
}
`;
