export const buttonStyles = /* css */`
.button {
  padding: var(--size-2) var(--size-4);
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
  border-radius: var(--radius-2);
  font-weight: var(--font-weight-7);
  cursor: pointer;
  font-size: var(--font-size-1);
  transition:
    background-color var(--theme-transition),
    color var(--theme-text-transition),
    border-color var(--theme-transition),
    transform var(--speed-2);
}

.button:hover {
  background-color: var(--button-bg-hover);
}

.button:active {
  transform: scale(0.98);
}
`;
