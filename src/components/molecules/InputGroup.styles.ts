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
  padding: var(--size-2);
  border: var(--border-size-2) solid var(--border-subtle);
  border-radius: var(--radius-2);
  font-size: var(--font-size-2);
  text-align: center;
  width: 100%;
  background: var(--surface);
  color: var(--text);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-2);
}
`;
