export const walksRowStyles = /* css */`
.walks-row {
  display: grid;
  grid-template-columns: var(--walks-table-columns);
  align-items: stretch;
  width: 100%;
}

.clear-walk-btn {
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  height: 1.75rem;
  min-block-size: 0;
  padding: 0 var(--size-2);
  background-color: var(--danger);
  color: var(--gray-0);
  border: none;
  border-radius: var(--radius-2);
  cursor: pointer;
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  line-height: var(--font-lineheight-0);
  transition:
    background-color var(--theme-transition),
    color var(--theme-text-transition),
    border-color var(--theme-transition);
}

.clear-walk-btn:hover {
  background-color: var(--danger-hover);
}
`;
