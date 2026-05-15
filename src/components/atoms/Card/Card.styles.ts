export const cardStyles = /* css */ `
.card {
  --card-flex: 0 0 auto;
  --card-width: auto;
  --card-height: auto;
  --card-min-height: auto;
  --card-max-height: none;
  --card-radius: var(--radius-3);
  --card-shadow: var(--shadow-3);
  background-color: var(--surface);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  flex: var(--card-flex);
  width: var(--card-width);
  height: var(--card-height);
  min-height: var(--card-min-height);
  max-height: var(--card-max-height);
  overflow: hidden;
}

.card[data-fill="true"] {
  --card-flex: 1;
  --card-min-height: calc(100dvh - (var(--page-gutter) * 2));
  --card-max-height: calc(100dvh - (var(--page-gutter) * 2));
}
`;
