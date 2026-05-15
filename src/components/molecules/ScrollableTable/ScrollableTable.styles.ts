export const scrollableTableStyles = /* css */`
.scrollable-table-container {
  --scrollable-table-columns: 1fr;
  --scrollable-table-mobile-columns: var(--scrollable-table-columns);
  --scrollable-table-header-height: 3.5rem;
  --scrollable-table-mobile-header-height: 2.75rem;
  --scrollable-table-row-height: 3rem;
  --scrollable-table-mobile-row-height: 2.5rem;
  --scrollable-table-scroll-body-rows: 4;
  --scrollable-table-mobile-scroll-body-rows: 3;
  --scrollable-table-current-scroll-body-rows: var(--scrollable-table-scroll-body-rows);
  --scrollable-table-inner-radius: calc(var(--radius-2) - var(--border-size-1));
  background-color: transparent;
  border: 0;
  display: flex;
  flex: 0 1 auto;
  height: auto;
  min-height: 0;
  min-width: 0;
  outline: 0;
  overflow: hidden;
  width: 100%;
}

.scrollable-table {
  background-color: var(--table-row-bg);
  border: var(--border-size-1) solid var(--table-border);
  border-collapse: separate;
  border-radius: var(--radius-2);
  border-spacing: 0;
  display: grid;
  grid-template-rows: var(--scrollable-table-header-height) auto;
  height: auto;
  max-height: 100%;
  min-height: 0;
  outline: 0;
  overflow: hidden;
  width: 100%;
}

.scrollable-table thead,
.scrollable-table tbody {
  display: block;
  min-width: 0;
}

.scrollable-table thead {
  overflow-y: auto;
}

.scrollable-table tbody {
  align-content: start;
  background-color: var(--table-row-bg);
  border-end-end-radius: var(--scrollable-table-inner-radius);
  border-end-start-radius: var(--scrollable-table-inner-radius);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: visible;
}

.scrollable-table-container[data-scrollable="true"] .scrollable-table thead,
.scrollable-table-container[data-scrollable="true"] .scrollable-table tbody {
  scrollbar-gutter: stable;
}

.scrollable-table-container[data-scrollable="true"] .scrollable-table tbody {
  max-height: calc(
    var(--scrollable-table-current-scroll-body-rows) *
    var(--scrollable-table-row-height)
  );
  overflow-y: auto;
}

.scrollable-table-row {
  align-items: stretch;
  display: grid;
  grid-template-columns: var(--scrollable-table-columns);
  margin: 0;
  max-width: 100%;
  min-width: 0;
  width: 100%;
}

.scrollable-table th {
  background-color: var(--table-header-bg);
  border-bottom: var(--border-size-1) solid var(--table-border);
  border-inline-end: var(--border-size-1) solid var(--table-border);
  box-sizing: border-box;
  color: var(--table-text);
  display: grid;
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-7);
  height: var(--scrollable-table-header-height);
  letter-spacing: var(--font-letterspacing-2);
  line-height: var(--font-lineheight-0);
  min-width: 0;
  overflow: hidden;
  padding: var(--size-2);
  place-items: center;
  text-align: center;
  text-transform: uppercase;
}

.scrollable-table td {
  background-color: var(--table-row-bg);
  border-bottom: var(--border-size-1) solid var(--table-border);
  border-inline-end: var(--border-size-1) solid var(--table-border);
  box-sizing: border-box;
  display: grid;
  height: var(--scrollable-table-row-height);
  min-height: 0;
  min-width: 0;
  place-items: center;
}

.scrollable-table tbody .scrollable-table-row {
  flex: 0 0 var(--scrollable-table-row-height);
  height: var(--scrollable-table-row-height);
  min-height: 0;
}

.scrollable-table tbody .scrollable-table-row:last-child > td {
  border-bottom: 0;
}

.scrollable-table tbody tr:hover td {
  background-color: var(--table-row-hover-bg);
}

.scrollable-table th[data-action-column="true"],
.scrollable-table td[data-action-column="true"] {
  border-inline-end: 0;
  border-inline-start: var(--border-size-2) solid var(--table-action-divider);
}

@media (max-width: 640px) {
  .scrollable-table-container {
    --scrollable-table-current-scroll-body-rows: var(--scrollable-table-mobile-scroll-body-rows);
    --scrollable-table-header-height: var(--scrollable-table-mobile-header-height);
    --scrollable-table-row-height: var(--scrollable-table-mobile-row-height);
  }

  .scrollable-table-row {
    grid-template-columns: var(--scrollable-table-mobile-columns);
  }

  .scrollable-table th {
    font-size: var(--font-size-0);
    letter-spacing: var(--font-letterspacing-1);
    padding: var(--size-1);
  }

  .scrollable-table td {
    font-size: var(--font-size-0);
  }

  .scrollable-table .button[data-size="compact"] {
    --button-height: 1.85rem;
    --button-font-size: var(--font-size-00);
    --button-padding-inline: var(--size-1);
    max-width: 100%;
  }
}
`;
