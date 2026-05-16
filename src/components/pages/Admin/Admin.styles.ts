export const adminStyles = /* css */ `
.admin-page {
  min-height: calc(100vh - (2 * var(--page-gutter)));
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
  padding: var(--size-5);
}

.admin-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
}

.admin-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(8rem, 0.45fr) auto;
  gap: var(--size-3);
  align-items: end;
}

.auth-field select {
  background: var(--surface);
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-2);
  color: var(--text);
  min-height: 2.75rem;
  padding: 0 var(--size-3);
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
  gap: var(--size-3);
  align-items: center;
  min-height: 3.25rem;
  padding: var(--size-3);
  border-bottom: var(--border-size-1) solid var(--border-subtle);
}

.admin-list-row:last-child {
  border-bottom: 0;
}

.admin-list-row a,
.admin-link {
  color: var(--button-text);
  font-weight: var(--font-weight-7);
  text-decoration: none;
}

.muted-text {
  color: var(--text-muted);
  font-size: var(--font-size-0);
}

.text-button {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--button-text);
  cursor: pointer;
  font: inherit;
  font-weight: var(--font-weight-7);
  padding: 0;
}

.score-summary {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
}

@media (max-width: 640px) {
  .admin-form,
  .admin-list-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
`;
