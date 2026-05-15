export const walksRowStyles = /* css */`
.walks-row {
  display: grid;
  grid-template-columns: var(--walks-table-columns);
  align-items: center;
  width: 100%;
}

.delete-btn {
  padding: var(--size-1) var(--size-2);
  background: var(--danger);
  color: var(--gray-0);
  border: none;
  border-radius: var(--radius-2);
  cursor: pointer;
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  transition: background var(--speed-2);
}

.delete-btn:hover {
  background: var(--danger-hover);
}
`;
