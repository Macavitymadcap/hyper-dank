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

.walks-table td:nth-child(6),
.walks-table th:nth-child(6) {
  border-inline-end: 0;
}

@media (max-width: 480px) {
  .walks-history {
    gap: var(--size-2);
  }

}
`;
