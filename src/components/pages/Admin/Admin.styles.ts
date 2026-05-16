export const adminStyles = /* css */ `
.admin-page {
  min-height: calc(100vh - (2 * var(--page-gutter)));
}

.admin-page .app-header {
  padding: var(--size-3);
}

.admin-page .title {
  font-size: var(--font-size-3);
  line-height: var(--font-lineheight-0);
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
  min-height: 0;
  overflow-y: auto;
  padding: var(--size-4);
}

.admin-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
}

.admin-section > .section-title {
  font-size: var(--font-size-1);
}

.admin-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(8rem, 0.45fr) auto;
  gap: var(--size-2);
  align-items: end;
}

.admin-form .button {
  --button-font-size: var(--font-size-0);
  --button-height: 2.35rem;
  --button-padding-inline: var(--size-3);
}

.admin-list {
  display: flex;
  flex-direction: column;
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-2);
  overflow: hidden;
}

.admin-list-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto auto;
  gap: var(--size-2);
  align-items: center;
  font-size: var(--font-size-0);
  min-height: 2.75rem;
  padding: var(--size-2);
  border-bottom: var(--border-size-1) solid var(--border-subtle);
}

.admin-list-row:last-child {
  border-bottom: 0;
}

.admin-list-row[data-selected="true"] {
  background: var(--table-row-hover-bg);
}

.admin-list-row a,
.admin-link {
  color: var(--button-text);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  text-decoration: none;
}

.muted-text {
  color: var(--text-muted);
  font-size: var(--font-size-0);
}

.admin-list-empty {
  padding: var(--size-3);
}

.score-summary {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
}

@media (max-width: 640px) {
  .admin-sections {
    gap: var(--size-3);
    padding: var(--size-3);
  }

  .admin-form {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .admin-form .form-field:first-child {
    grid-column: 1 / -1;
  }

  .admin-list-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .admin-page .title {
    font-size: var(--font-size-2);
  }
}
`;
