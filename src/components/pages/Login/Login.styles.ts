export const loginStyles = /* css */ `
.auth-card {
  min-height: calc(100vh - (2 * var(--page-gutter)));
}

.auth-header {
  background-color: var(--surface);
  padding: var(--size-4);
  border-bottom: var(--border-size-2) solid var(--primary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
  padding: var(--size-5);
}

.auth-title {
  color: var(--text);
  font-size: var(--font-size-4);
  margin: 0;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
  color: var(--text);
  font-weight: var(--font-weight-6);
}

.auth-field input {
  background: var(--surface);
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-2);
  color: var(--text);
  min-height: 2.75rem;
  padding: 0 var(--size-3);
}

.form-error {
  background: var(--red-1);
  border: var(--border-size-1) solid var(--red-6);
  border-radius: var(--radius-2);
  color: var(--red-9);
  margin: 0;
  padding: var(--size-3);
}
`;
