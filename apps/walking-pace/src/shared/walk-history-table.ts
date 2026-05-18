interface WalkHistoryTableColumnSizing {
  key: string;
  mobileWidth?: string;
  width: string;
}

export const walkHistoryTableColumns = {
  createdAt: {
    key: "created-at",
    width: "minmax(6.75rem, 1.2fr)",
    mobileWidth: "minmax(0, 1.45fr)",
  },
  miles: {
    key: "miles",
    width: "minmax(3.4rem, 0.62fr)",
    mobileWidth: "minmax(0, 0.58fr)",
  },
  minutes: {
    key: "minutes",
    width: "minmax(3.6rem, 0.68fr)",
    mobileWidth: "minmax(0, 0.64fr)",
  },
  seconds: {
    key: "seconds",
    width: "minmax(3.6rem, 0.68fr)",
    mobileWidth: "minmax(0, 0.64fr)",
  },
  speed: {
    key: "speed",
    width: "minmax(4.15rem, 0.78fr)",
    mobileWidth: "minmax(0, 0.76fr)",
  },
  pace: {
    key: "pace",
    width: "minmax(4.9rem, 0.92fr)",
    mobileWidth: "minmax(0, 0.9fr)",
  },
  actions: {
    key: "actions",
    width: "minmax(5.75rem, 0.98fr)",
    mobileWidth: "minmax(4.8rem, 1fr)",
  },
} satisfies Record<string, WalkHistoryTableColumnSizing>;

export const WALK_HISTORY_ROW_HEIGHT = "3.5rem";
export const WALK_HISTORY_MOBILE_ROW_HEIGHT = "3.75rem";

export function buildWalkHistoryColumnsTemplate() {
  return Object.values(walkHistoryTableColumns)
    .map((column) => column.width)
    .join(" ");
}

export function buildWalkHistoryMobileColumnsTemplate() {
  return Object.values(walkHistoryTableColumns)
    .map((column) => column.mobileWidth ?? column.width)
    .join(" ");
}
