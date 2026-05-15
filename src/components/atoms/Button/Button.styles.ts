export const buttonStyles = /* css */`
.button {
  --button-current-bg: var(--button-bg);
  --button-current-bg-hover: var(--button-bg-hover);
  --button-current-border: transparent;
  --button-current-text: var(--button-text);
  --button-height: 2.75rem;
  --button-padding-inline: var(--size-4);
  --button-font-size: var(--font-size-1);
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  min-height: var(--button-height);
  min-width: 0;
  padding: 0 var(--button-padding-inline);
  background-color: var(--button-current-bg);
  color: var(--button-current-text);
  border: var(--border-size-1) solid var(--button-current-border);
  border-radius: var(--radius-2);
  font-weight: var(--font-weight-7);
  cursor: pointer;
  font-size: var(--button-font-size);
  line-height: var(--font-lineheight-0);
  white-space: nowrap;
  transition:
    background-color var(--theme-transition),
    color var(--theme-text-transition),
    border-color var(--theme-transition),
    transform var(--speed-2);
}

.button[data-size="compact"] {
  --button-height: 1.75rem;
  --button-padding-inline: var(--size-2);
  --button-font-size: var(--font-size-0);
}

.button[data-variant="danger"] {
  --button-current-bg: var(--danger);
  --button-current-bg-hover: var(--danger-hover);
  --button-current-text: var(--gray-0);
}

.button[data-variant="outline"] {
  --button-current-bg: transparent;
  --button-current-bg-hover: var(--table-row-hover-bg);
  --button-current-border: var(--table-border);
  --button-current-text: var(--table-text);
}

.button:hover {
  background-color: var(--button-current-bg-hover);
}

.button:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .button[data-size="compact"] {
    --button-height: 1.6rem;
    --button-padding-inline: var(--size-1);
    --button-font-size: var(--font-size-00);
  }
}
`;
