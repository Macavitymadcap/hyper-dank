import { Switch } from "@macavitymadcap/hyper-dank-ui";
import type { Preview } from "@storybook/html-vite";
import "../libs/components/src/styles.css";
import "../apps/walking-pace/src/client/styles.css";
import "./storybook.css";

type StorybookTheme = "light" | "dark";

const appThemeControlId = "storybook-app-theme-control";
const appThemeSwitchId = "storybook-app-theme-switch";

const quickLinks = [
  { href: "../", label: "Docs" },
  { href: "../libraries/", label: "Libraries" },
  { href: "../pace/", label: "Demo" },
];

const getTheme = (value: unknown): StorybookTheme => (value === "dark" ? "dark" : "light");

const applyTheme = (theme: StorybookTheme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.body.dataset.theme = theme;
};

const syncAppThemeSwitch = (
  theme: StorybookTheme,
  updateGlobals?: (globals: Record<string, unknown>) => void,
) => {
  let control = document.getElementById(appThemeControlId);
  if (!control) {
    control = document.createElement("div");
    control.id = appThemeControlId;
    control.className = "storybook-theme-control";
    document.body.append(control);
  }

  const quickLinkMarkup = quickLinks
    .map(
      (link) =>
        `<a class="storybook-utility-control__link" href="${link.href}" target="_top">${link.label}</a>`,
    )
    .join("");

  control.innerHTML = [
    '<nav class="storybook-utility-control__links" aria-label="Storybook quick links">',
    quickLinkMarkup,
    "</nav>",
    '<div class="storybook-utility-control__theme">',
    String(
      Switch({
        checked: theme === "dark",
        dataThemeToggle: true,
        id: appThemeSwitchId,
        label: "Storybook color mode",
      }),
    ),
    "</div>",
  ].join("");

  const input = control.querySelector<HTMLInputElement>("input");
  if (!input) return;

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    input.checked = !input.checked;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  input.addEventListener("change", () => {
    const nextTheme = input.checked ? "dark" : "light";
    input.setAttribute("aria-checked", String(input.checked));
    applyTheme(nextTheme);
    updateGlobals?.({ theme: nextTheme });
  });
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = getTheme(context.globals.theme);
      const updateGlobals =
        "updateGlobals" in context && typeof context.updateGlobals === "function"
          ? context.updateGlobals.bind(context)
          : undefined;

      applyTheme(theme);
      syncAppThemeSwitch(theme, updateGlobals);

      return Story();
    },
  ],
  initialGlobals: {
    a11y: {
      manual: false,
    },
    theme: "light",
  },
  parameters: {
    a11y: {
      test: "error",
    },
    actions: {
      clearOnStoryChange: true,
    },
    controls: {
      expanded: true,
    },
    docs: {
      toc: true,
    },
    layout: "centered",
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          ["Component Philosophy", "Reference Map"],
          "Components",
          ["Atoms", "Molecules", "Organisms", "Pages", "Templates", "Generic"],
          "Guides",
        ],
      },
    },
  },
};

export default preview;
