export const inputGroupStyles = /* css */`
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.input-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
}

input[type="number"] {
  appearance: textfield;
  padding: var(--size-2);
  border: var(--border-size-2) solid var(--border-subtle);
  border-radius: var(--radius-2);
  font-size: var(--font-size-2);
  text-align: center;
  width: 100%;
  background-color: var(--surface);
  color: var(--text);
  transition:
    border-color var(--speed-2),
    box-shadow var(--speed-2);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-2);
}

@media (max-width: 480px) {
  .input-label {
    letter-spacing: var(--font-letterspacing-1);
  }

  input[type="number"] {
    min-height: 2.4rem;
    padding: var(--size-1);
    font-size: var(--font-size-1);
  }
}
`;
