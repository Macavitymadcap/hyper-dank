export const buttonStyles = /* css */`
.button {
  padding: var(--size-2) var(--size-4);
  background: var(--button-bg);
  color: var(--primary);
  border: none;
  border-radius: var(--radius-2);
  font-weight: var(--font-weight-7);
  cursor: pointer;
  font-size: var(--font-size-1);
  transition: background var(--speed-2);
}

.button:hover {
  background: var(--button-bg-hover);
}

.button:active {
  transform: scale(0.98);
}
`;
