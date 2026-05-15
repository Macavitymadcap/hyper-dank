export const chipStyles = /* css */`
.chip {
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-round);
  color: var(--text-muted);
  display: inline-grid;
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-0);
  min-height: 1.75rem;
  padding: 0 var(--size-2);
  place-items: center;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .chip {
    font-size: var(--font-size-00);
    min-height: 1.5rem;
    padding: 0 var(--size-1);
  }
}
`;
