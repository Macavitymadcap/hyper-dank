export const loginStyles = /* css */ `
.auth-card {
  align-self: center;
  width: min(100%, 28rem);
}

.auth-header {
  background-color: var(--surface);
  padding: var(--size-3);
  border-bottom: var(--border-size-2) solid var(--primary);
}

.auth-card .title {
  font-size: var(--font-size-3);
  line-height: var(--font-lineheight-0);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
  padding: var(--size-4);
}

.auth-title {
  color: var(--text);
  font-size: var(--font-size-3);
  margin: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
  color: var(--text);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
}

.form-field input,
.form-field select {
  background: var(--surface);
  border: var(--border-size-1) solid var(--border-subtle);
  border-radius: var(--radius-2);
  color: var(--text);
  font-size: var(--font-size-1);
  min-height: 2.35rem;
  padding: 0 var(--size-2);
}

.form-error {
  background: var(--red-1);
  border: var(--border-size-1) solid var(--red-6);
  border-radius: var(--radius-2);
  color: var(--red-9);
  margin: 0;
  padding: var(--size-3);
}

@media (max-width: 480px) {
  .auth-card .title,
  .auth-title {
    font-size: var(--font-size-2);
  }

  .auth-form {
    padding: var(--size-3);
  }
}
`;
