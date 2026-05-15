export const homeStyles = /* css */ `
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-3);
  background-color: var(--surface);
  padding: var(--size-4);
  border-bottom: var(--border-size-2) solid var(--primary);
  position: sticky;
  top: 0;
  z-index: var(--layer-5);
  border-start-start-radius: var(--radius-3);
  border-start-end-radius: var(--radius-3);
  box-shadow: var(--shadow-2);
}

.title {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  margin: 0;
  color: var(--text);
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
  padding: var(--size-5) var(--size-2);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.page-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
}

.section-card {
  padding: var(--size-4);
  border: var(--border-size-1) solid var(--border-subtle);
}

.page-section:last-child {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

#walks-list {
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

.section-title {
  color: var(--text);
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-1);
  margin: 0;
}

@media (max-width: 480px) {
  .app-header {
    gap: var(--size-2);
    padding: var(--size-3);
  }

  .title {
    font-size: var(--font-size-4);
    line-height: 1;
    max-width: 13rem;
  }

  .content-sections {
    gap: var(--size-3);
    padding: var(--size-3) var(--size-2);
  }

  .page-section {
    gap: var(--size-2);
  }

  .section-card {
    padding: var(--size-3);
  }

  .page-section:last-child {
    min-height: calc(2.75rem + (2 * 2.5rem));
  }

  .section-title {
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-0);
  }
}
`;
