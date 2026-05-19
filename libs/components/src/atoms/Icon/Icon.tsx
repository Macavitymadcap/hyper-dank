export interface IconProps {
  label?: string;
  name: string;
  tone?: "muted" | "neutral" | "success" | "warning";
}

export const Icon = ({ label, name, tone = "neutral" }: IconProps) => {
  const icon = getIcon(name);
  const className = `icon icon-${tone}`;

  if (label) {
    return (
      <span aria-label={label} className={className} data-icon={icon.id} role="img">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          {icon.paths}
        </svg>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={className} data-icon={icon.id}>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        {icon.paths}
      </svg>
    </span>
  );
};

function getIcon(name: string) {
  const iconName = aliases[name] ?? name;
  const paths = icons[iconName];

  return {
    id: paths ? iconName : "circle",
    paths: paths ?? icons.circle,
  };
}

const aliases: Record<string, string> = {
  add: "plus",
  auto_awesome: "sparkles",
  book: "book-open",
  check: "check-circle",
  check_circle: "check-circle",
  delete: "trash",
  edit: "pencil",
  external_link: "external-link",
  dark_mode: "moon",
  light_mode: "sun",
  radio_button_unchecked: "circle",
  save: "floppy",
  settings: "gear",
  warning_amber: "warning",
  workspace_premium: "star",
};

const icons: Record<string, unknown> = {
  "book-open": (
    <path
      d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  calendar: (
    <path
      d="M4 5h16v15H4zM8 3v4M16 3v4M4 10h16"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="2.25" />
      <path
        d="M8.25 12.15l2.25 2.25 5.25-5.4"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.25"
      />
    </>
  ),
  circle: <circle cx="12" cy="12" r="7.25" fill="none" stroke="currentColor" stroke-width="2.5" />,
  close: (
    <path
      d="M6.5 6.5l11 11M17.5 6.5l-11 11"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2.5"
    />
  ),
  database: (
    <path
      d="M5 5.5c0-1.7 3.1-3 7-3s7 1.3 7 3v9c0 1.7-3.1 3-7 3s-7-1.3-7-3zM5 5.5c0 1.7 3.1 3 7 3s7-1.3 7-3M5 10c0 1.7 3.1 3 7 3s7-1.3 7-3"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  dice: (
    <>
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="3"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" />
    </>
  ),
  document: (
    <path
      d="M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h5M9.5 16h5"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  download: (
    <path
      d="M12 4v10M8 10l4 4 4-4M5 19h14"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2.3"
    />
  ),
  "external-link": (
    <path
      d="M10 6H6v12h12v-4M13 5h6v6M12 12l7-7"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  filter: (
    <path
      d="M4 6h16l-6 7v5l-4 2v-7z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  floppy: (
    <path
      d="M5 4h12l2 2v14H5zM8 4v6h8V4M8 20v-6h8v6"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  folder: (
    <path
      d="M3.5 7.5h7l2 2h8v9h-17z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" stroke-width="2" />
      <path
        d="M12 3.5v2M12 18.5v2M4.7 7.8l1.7 1M17.6 15.2l1.7 1M4.7 16.2l1.7-1M17.6 8.8l1.7-1M3.5 12h2M18.5 12h2"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      />
    </>
  ),
  home: (
    <path
      d="M4 11.5l8-7 8 7V20h-5v-5.5H9V20H4z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  lock: (
    <path
      d="M5 10h14v10H5zM8.5 10V7.8a3.5 3.5 0 017 0V10"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  map: (
    <path
      d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  menu: (
    <>
      <path
        d="M4.5 7h15"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2.4"
      />
      <path
        d="M4.5 12h15"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2.4"
      />
      <path
        d="M4.5 17h15"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2.4"
      />
    </>
  ),
  moon: (
    <path
      d="M20.4 14.7A8.8 8.8 0 019.3 3.6 8.8 8.8 0 1012 21.1a8.8 8.8 0 008.4-6.4z"
      fill="currentColor"
    />
  ),
  pencil: (
    <path
      d="M4.5 16.7V20h3.3L18.9 8.9l-3.3-3.3zM14.6 6.6l3.3 3.3"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  plus: (
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2.5"
    />
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2.2" />
      <path
        d="M15 15l4.5 4.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2.2"
      />
    </>
  ),
  shield: (
    <path
      d="M12 3.5l7 2.5v5.2c0 4.3-2.8 7.4-7 9.3-4.2-1.9-7-5-7-9.3V6z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  sparkles: (
    <>
      <path
        d="M10.9 3.7l1.8 4.1 4.1 1.8-4.1 1.8-1.8 4.1-1.8-4.1L5 9.6l4.1-1.8 1.8-4.1z"
        fill="currentColor"
      />
      <path d="M17.6 12.6l0.9 2 2 0.9-2 0.9-0.9 2-0.9-2-2-0.9 2-0.9 0.9-2z" fill="currentColor" />
      <path
        d="M5.9 14.4l0.7 1.5 1.5 0.7-1.5 0.7-0.7 1.5-0.7-1.5-1.5-0.7 1.5-0.7 0.7-1.5z"
        fill="currentColor"
      />
    </>
  ),
  star: (
    <path
      d="M12 3.1l2.45 5.2 5.55 0.85-4.05 4.05 0.95 5.7L12 16.15 7.1 18.9l0.95-5.7L4 9.15l5.55-0.85L12 3.1z"
      fill="currentColor"
    />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.35" fill="currentColor" />
      <path
        d="M12 1.8a1 1 0 011 1v1.1a1 1 0 11-2 0V2.8a1 1 0 011-1zM12 19.1a1 1 0 011 1v1.1a1 1 0 11-2 0v-1.1a1 1 0 011-1zM4.8 3.95a1 1 0 011.42 0L7 4.74a1 1 0 01-1.42 1.42l-.78-.79a1 1 0 010-1.42zM17 17a1 1 0 011.42 0l.78.79a1 1 0 01-1.42 1.42L17 18.42A1 1 0 0117 17zM1.8 12a1 1 0 011-1h1.1a1 1 0 110 2H2.8a1 1 0 01-1-1zM19.1 12a1 1 0 011-1h1.1a1 1 0 110 2h-1.1a1 1 0 01-1-1zM4.8 20.05a1 1 0 010-1.42l.78-.79A1 1 0 117 19.26l-.78.79a1 1 0 01-1.42 0zM17 7a1 1 0 010-1.42l.78-.79a1 1 0 011.42 1.42l-.78.79A1 1 0 0117 7z"
        fill="currentColor"
      />
    </>
  ),
  tag: (
    <path
      d="M4.5 5.5V12l7.5 7.5 7-7-7.5-7.5zM8.2 8.2h.1"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  trash: (
    <path
      d="M5 7h14M9 7V5h6v2M8 10v8M12 10v8M16 10v8M7 7l1 13h8l1-13"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
  upload: (
    <path
      d="M12 14V4M8 8l4-4 4 4M5 19h14"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2.3"
    />
  ),
  user: (
    <path
      d="M12 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5 20c1.1-3.5 3.5-5.2 7-5.2s5.9 1.7 7 5.2"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
    />
  ),
  warning: (
    <path
      d="M12 4l9 16H3zM12 9v5M12 17.5v.1"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  ),
};
