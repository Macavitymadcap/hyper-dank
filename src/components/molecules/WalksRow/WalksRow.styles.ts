export const walksRowStyles = /* css */ `
.walk-created-at {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--size-1);
  justify-content: center;
  text-align: center;
  white-space: normal;
}

@media (max-width: 480px) {
  .walk-created-at {
    display: grid;
    gap: 0;
    line-height: var(--font-lineheight-0);
  }
}
`;
