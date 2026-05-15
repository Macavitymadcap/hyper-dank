export const homeStyles = /* css */`
.container {
  background: var(--surface);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-3);
  overflow: visible;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--size-3);
  background: var(--surface);
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
}

.page-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
}

.section-title {
  color: var(--text);
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-1);
  margin: 0;
}
`;
