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
  overflow: hidden;
  background-image: linear-gradient(110deg, var(--gray-2) 0%, var(--cyan-2) 34%, var(--blue-5) 66%, var(--indigo-8) 100%);
  background-size: 260% 100%;
  background-position: 0% 50%;
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-round);
  color: var(--switch-icon);
  transition: background-position 720ms var(--ease-3), border-color var(--speed-2), color var(--speed-2);
}

.switch-track::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(110deg, var(--gray-1), var(--cyan-1), var(--blue-6), var(--indigo-9));
  background-size: 260% 100%;
  background-position: 0% 50%;
  opacity: 0.48;
  transition: background-position 720ms var(--ease-3), opacity 720ms var(--ease-3);
}

.switch-thumb {
  position: absolute;
  inset-block: var(--size-1);
  inset-inline-start: var(--size-1);
  width: 1.75rem;
  border-radius: var(--radius-round);
  background-image: linear-gradient(135deg, var(--gray-0) 0%, var(--cyan-0) 36%, var(--blue-2) 68%, var(--gray-12) 100%);
  background-size: 280% 100%;
  background-position: 0% 50%;
  box-shadow: var(--shadow-2);
  transition: transform 720ms var(--ease-3), background-position 720ms var(--ease-3), box-shadow var(--speed-2);
  z-index: 0;
}

.switch-thumb::before {
  content: "";
  position: absolute;
  inset: var(--size-1);
  border-radius: inherit;
  background: radial-gradient(circle, rgb(255 255 255 / 0.65), transparent 62%);
  opacity: 0.8;
  transition: opacity 720ms var(--ease-3);
}

.switch-icon {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  font-size: var(--font-size-3);
  line-height: 1;
  transition: opacity var(--speed-2), transform 720ms var(--ease-3), color var(--speed-2);
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

.switch-input:checked + .switch-track::before {
  background-position: 100% 50%;
  opacity: 0.68;
}

.switch-input:checked + .switch-track .switch-thumb {
  transform: translateX(2rem);
  background-position: 100% 50%;
}

.switch-input:checked + .switch-track .switch-thumb::before {
  opacity: 0.22;
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
