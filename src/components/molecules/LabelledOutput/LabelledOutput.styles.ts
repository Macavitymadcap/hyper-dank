export const labelledOutputStyles = /* css */ `
.labelled-output {
  align-content: center;
  background-color: var(--surface-raised);
  border-radius: var(--radius-2);
  display: grid;
  gap: var(--size-2);
  min-height: 5rem;
  padding: var(--size-3);
  text-align: center;
}

.labelled-output-label {
  color: var(--text-muted);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  letter-spacing: var(--font-letterspacing-2);
  line-height: var(--font-lineheight-0);
  text-transform: uppercase;
}

.labelled-output-value {
  color: var(--text);
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-0);
}

@media (max-width: 480px) {
  .labelled-output {
    gap: var(--size-1);
    min-height: 4rem;
    padding: var(--size-2);
  }

  .labelled-output-label {
    letter-spacing: var(--font-letterspacing-1);
  }

  .labelled-output-value {
    font-size: var(--font-size-4);
  }
}
`;
