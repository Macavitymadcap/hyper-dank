export const cardStyles = /* css */`
.card {
  background-color: var(--surface);
  border-radius: var(--card-radius, var(--radius-3));
  box-shadow: var(--card-shadow, var(--shadow-3));
  display: flex;
  flex-direction: column;
  flex: var(--card-flex, 0 0 auto);
  width: var(--card-width, auto);
  height: var(--card-height, auto);
  min-height: var(--card-min-height, auto);
  max-height: var(--card-max-height, none);
  overflow: hidden;
}

.card[data-fill="true"] {
  --card-flex: 1;
  --card-min-height: calc(100vh - (var(--size-4) * 2));
  --card-max-height: calc(100vh - (var(--size-4) * 2));
}
`;
