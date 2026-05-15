export const switchStyles = /* css */`
.switch {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);
  cursor: pointer;
  user-select: none;
}

.switch-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.switch-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch-track {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 4.25rem;
  height: 2.25rem;
  padding: var(--size-1);
  background-image: linear-gradient(110deg, var(--yellow-2) 0%, var(--orange-3) 38%, var(--blue-5) 62%, var(--indigo-8) 100%);
  background-size: 230% 100%;
  background-position: 0% 50%;
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-round);
  color: var(--switch-icon);
  transition: background-position 420ms var(--ease-3), border-color var(--speed-2), color var(--speed-2);
}

.switch-thumb {
  position: absolute;
  inset-block: var(--size-1);
  inset-inline-start: var(--size-1);
  width: 1.75rem;
  border-radius: var(--radius-round);
  background: var(--switch-thumb);
  box-shadow: var(--shadow-2);
  transition: transform 420ms var(--ease-3), background var(--speed-2);
  z-index: 0;
}

.switch-icon {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  font-size: var(--font-size-3);
  line-height: 1;
  transition: opacity var(--speed-2), transform 420ms var(--ease-3);
}

.switch-icon-light {
  color: var(--yellow-9);
}

.switch-icon-dark {
  color: var(--gray-0);
}

.switch-input:checked + .switch-track {
  background-position: 100% 50%;
}

.switch-input:checked + .switch-track .switch-thumb {
  transform: translateX(2rem);
}

.switch-input:focus-visible + .switch-track {
  outline: var(--border-size-2) solid var(--primary);
  outline-offset: var(--size-1);
}

.switch-input:not(:checked) + .switch-track .switch-icon-dark,
.switch-input:checked + .switch-track .switch-icon-light {
  opacity: 0.42;
  transform: scale(0.84);
}
`;
