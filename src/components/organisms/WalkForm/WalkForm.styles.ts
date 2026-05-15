export const walkFormStyles = /* css */ `
.form-section {
  background-color: var(--form-bg);
  color: var(--form-text);
  border-color: transparent;
}

.input-row {
  display: flex;
  flex-direction: row;
  gap: var(--size-3);
  justify-content: space-evenly;
  width: 100%;
}

.form-section .input-label {
  color: var(--form-text);
}

@media (max-width: 480px) {
  .input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(3.75rem, 0.8fr);
    gap: var(--size-2);
    align-items: stretch;
  }

  .form-section .input-group {
    min-width: 0;
  }

  .form-section .button {
    min-width: 0;
    padding: 0 var(--size-2);
  }
}
`;
