import { setTimeout as delay } from "node:timers/promises";
import type { Theme } from "@macavitymadcap/hyper-dank-automation";
import type { Page } from "@playwright/test";
import { LOCAL_DEV_PASSWORD, seedLocalDevPresets } from "../../src/envs/local/local-presets";
import {
  addWalk as addServerWalk,
  clearWalks as clearServerWalks,
  type InMemoryAppServer,
  type SampleWalk,
} from "./app-server";

export interface ScreenshotFlowContext {
  page: Page;
  server: InMemoryAppServer;
  theme: Theme;
}

export interface ScreenshotStateBehavior {
  authUserId?: string | null;
  label: string;
  path?: string;
  setup?: (context: ScreenshotFlowContext) => Promise<void>;
  afterLoad?: (context: ScreenshotFlowContext) => Promise<void>;
  slug: string;
}

export interface ScreenshotFlow {
  defaultAuthUserId?: string | null;
  description: string;
  id: string;
  label: string;
  setup?: (context: ScreenshotFlowContext) => Promise<void>;
  states: ScreenshotStateBehavior[];
}

interface BrowserElement {
  append(...nodes: BrowserElement[]): void;
  getAttribute(name: string): string | null;
  remove(): void;
  scrollIntoView(options?: { block?: string }): void;
  setAttribute(name: string, value: string): void;
  style: { cssText: string };
  textContent: string | null;
  type: string;
}

interface BrowserInputElement extends BrowserElement {
  checked: boolean;
}

interface BrowserDocument {
  body: BrowserElement;
  documentElement: {
    dataset: Record<string, string | undefined>;
    style: { colorScheme: string };
  };
  createElement(tagName: string): BrowserElement;
  querySelector(selector: string): BrowserElement | null;
}

interface BrowserGlobals {
  document: BrowserDocument;
  HTMLInputElement: abstract new (...args: never[]) => BrowserInputElement;
  localStorage: {
    setItem(key: string, value: string): void;
  };
}

const sampleWalks: SampleWalk[] = [
  { miles: "1.2", minutes: "18", seconds: "55" },
  { miles: "1.4", minutes: "20", seconds: "12" },
  { miles: "0.8", minutes: "11", seconds: "30" },
  { miles: "2.0", minutes: "31", seconds: "20" },
  { miles: "1.1", minutes: "16", seconds: "45" },
  { miles: "1.6", minutes: "24", seconds: "5" },
  { miles: "0.9", minutes: "13", seconds: "40" },
  { miles: "2.2", minutes: "34", seconds: "10" },
  { miles: "1.3", minutes: "19", seconds: "25" },
  { miles: "1.7", minutes: "26", seconds: "50" },
  { miles: "1.0", minutes: "14", seconds: "55" },
  { miles: "1.9", minutes: "29", seconds: "15" },
];

export const screenshotFlows: ScreenshotFlow[] = [
  {
    id: "walks",
    label: "Walks",
    description: "Original PR screenshot states for the tracker table.",
    defaultAuthUserId: "user@example.com",
    setup: seedWalksUser,
    states: [
      {
        label: "No walks",
        slug: "no-walks",
        setup: clearWalks,
      },
      {
        label: "One walk",
        slug: "one-walk",
        setup: async (context) => {
          await clearWalks(context);
          await addSampleWalk(context, sampleWalks[0]);
        },
      },
      {
        label: "Many walks",
        slug: "many-walks",
        setup: seedManyWalks,
      },
      {
        label: "Confirm clear all",
        slug: "confirm-clear-all",
        setup: seedManyWalks,
        afterLoad: renderConfirmClearAll,
      },
    ],
  },
  {
    id: "pace-0002",
    label: "Pace 0002 Auth",
    description: "Auth, account state, admin, and invitation review screens for this ticket.",
    setup: seedLocalDevUsers,
    states: [
      {
        authUserId: null,
        label: "Login",
        path: "/login",
        slug: "login",
      },
      {
        authUserId: null,
        label: "Login error",
        path: "/login",
        slug: "login-error",
        afterLoad: renderLoginError,
      },
      {
        authUserId: "walker@example.com",
        label: "User dashboard",
        slug: "user-dashboard",
      },
      {
        authUserId: "history@example.com",
        label: "Long history",
        slug: "long-history",
      },
      {
        authUserId: "empty@example.com",
        label: "Empty account",
        slug: "empty-account",
      },
      {
        authUserId: "admin@example.com",
        label: "Admin accounts",
        path: "/admin",
        slug: "admin-accounts",
      },
      {
        authUserId: "admin@example.com",
        label: "Demo invite notice",
        path: "/admin",
        slug: "demo-invite-notice",
        afterLoad: renderDemoInviteNotice,
      },
      {
        authUserId: "admin@example.com",
        label: "Admin score review",
        path: "/admin?userId=history@example.com",
        slug: "admin-score-review",
        afterLoad: scrollScoresIntoView,
      },
      {
        authUserId: null,
        label: "Accept invite",
        path: "/invite/demo-token",
        slug: "accept-invite",
      },
    ],
  },
  {
    id: "storybook-reference",
    label: "Storybook Reference",
    description: "Consumer-reference Storybook pages for shared icons, contracts, and guides.",
    states: [
      {
        authUserId: null,
        label: "Icon catalogue",
        path: "/storybook/iframe.html?id=components-shared-core-primitives--icon-catalogue",
        slug: "icon-catalogue",
      },
      {
        authUserId: null,
        label: "Low-state primitives",
        path: "/storybook/iframe.html?id=components-shared-low-state-primitives--low-state-set",
        slug: "low-state-primitives",
      },
      {
        authUserId: null,
        label: "Component contracts",
        path: "/storybook/iframe.html?id=introduction-component-contracts--reference-map",
        slug: "component-contracts",
      },
      {
        authUserId: null,
        label: "Using Hyper-Dank",
        path: "/storybook/iframe.html?id=guides-using-hyper-dank--usage",
        slug: "using-hyper-dank",
      },
    ],
  },
  {
    id: "hd-0023-selection-commands",
    label: "HD 0023 Selection Commands",
    description: "Command, combobox, select, and menu action guidance for hd-0023.",
    states: [
      {
        authUserId: null,
        label: "Selection and commands",
        path: "/storybook/iframe.html?id=components-shared-core-primitives--selection-and-commands",
        slug: "selection-and-commands",
      },
      {
        authUserId: null,
        label: "Command results",
        path: "/storybook/iframe.html?id=components-shared-core-primitives--selection-and-commands",
        slug: "command-results",
        afterLoad: scrollCommandResultsIntoView,
      },
    ],
  },
  {
    id: "hd-0024-status-notifications",
    label: "HD 0024 Status Notifications",
    description: "Status symbols, notification banners, and feedback hierarchy for hd-0024.",
    states: [
      {
        authUserId: null,
        label: "Status and notifications",
        path: "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--status-and-notifications",
        slug: "status-and-notifications",
      },
    ],
  },
  {
    id: "hd-0025-data-tables",
    label: "HD 0025 Data Tables",
    description: "Dense table, filter summary, sort state, and row-action guidance for hd-0025.",
    states: [
      {
        authUserId: null,
        label: "Dense dashboard table",
        path: "/storybook/iframe.html?id=components-shared-molecules-scrollabletable--dense-dashboard-table",
        slug: "dense-dashboard-table",
      },
    ],
  },
  {
    id: "hd-0065-staged-form",
    label: "HD 0065 Staged Form",
    description: "Staged form workflow, progress, validation, and route-owned action guidance.",
    states: [
      {
        authUserId: null,
        label: "Staged form workflow",
        path: "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--staged-form-workflow",
        slug: "staged-form-workflow",
      },
      {
        authUserId: null,
        label: "Staged form actions",
        path: "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--staged-form-workflow",
        slug: "staged-form-actions",
        afterLoad: scrollStagedFormActionsIntoView,
      },
    ],
  },
  {
    id: "hd-0068-breadcrumbs",
    label: "HD 0068 Breadcrumbs",
    description: "Breadcrumb separator evidence for the dedicated shared Breadcrumbs story.",
    states: [
      {
        authUserId: null,
        label: "Breadcrumb separators",
        path: "/storybook/iframe.html?id=components-shared-molecules-breadcrumbs--linked-current",
        slug: "breadcrumb-separators",
      },
    ],
  },
  {
    id: "hd-0010-storybook-groups",
    label: "HD 0010 Storybook Groups",
    description: "Visual review evidence for the shared Storybook groups rewritten in hd-0004.",
    states: [
      {
        authUserId: null,
        label: "Disclosure and menu",
        path: "/storybook/iframe.html?id=components-shared-existing-primitives--disclosure-and-menu",
        slug: "disclosure-and-menu",
        afterLoad: openExampleMenu,
      },
      {
        authUserId: null,
        label: "Surfaces and metadata",
        path: "/storybook/iframe.html?id=components-shared-existing-primitives--surfaces-and-metadata",
        slug: "surfaces-and-metadata",
      },
      {
        authUserId: null,
        label: "Shell navigation and feedback",
        path: "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--shell-navigation-and-feedback",
        slug: "shell-navigation-and-feedback",
      },
      {
        authUserId: null,
        label: "Content and empty states",
        path: "/storybook/iframe.html?id=components-shared-app-surfaces-and-feedback--content-and-empty-states",
        slug: "content-and-empty-states",
      },
      {
        authUserId: null,
        label: "Reuse set",
        path: "/storybook/iframe.html?id=components-shared-reusable-patterns--reuse-set",
        slug: "reuse-set",
      },
    ],
  },
];

export function selectScreenshotFlows(flowIds: string[]): ScreenshotFlow[] {
  if (flowIds.length === 0) return [getScreenshotFlow("walks")];
  if (flowIds.includes("all")) return screenshotFlows;

  return flowIds.map(getScreenshotFlow);
}

export function listScreenshotFlows(): string {
  return screenshotFlows.map((flow) => `${flow.id}: ${flow.description}`).join("\n");
}

export async function setTheme(page: Page, theme: Theme) {
  const applySelectedTheme = async () => {
    await page.evaluate((selectedTheme) => {
      const browser = globalThis as unknown as BrowserGlobals;
      const document = browser.document;

      browser.localStorage.setItem("pace-calculator-theme", selectedTheme);
      document.documentElement.dataset.theme = selectedTheme;
      document.documentElement.style.colorScheme = selectedTheme;
      document.body.setAttribute("data-theme", selectedTheme);

      const toggle = document.querySelector("[data-theme-toggle]");
      if (toggle instanceof browser.HTMLInputElement) {
        const isDark = selectedTheme === "dark";
        toggle.checked = isDark;
        toggle.setAttribute("aria-checked", String(isDark));
      }
    }, theme);
  };

  await applySelectedTheme();
  await delay(60);
  await applySelectedTheme();
  await delay(560);
}

async function clearWalks({ server }: ScreenshotFlowContext) {
  await clearServerWalks(server.url);
}

async function addSampleWalk(context: ScreenshotFlowContext, walk: SampleWalk | undefined) {
  await addServerWalk(context.server.url, walk);
}

async function seedManyWalks(context: ScreenshotFlowContext) {
  await clearWalks(context);
  for (const walk of sampleWalks) {
    await addSampleWalk(context, walk);
  }
}

async function seedWalksUser({ server }: ScreenshotFlowContext) {
  const existingUser = (await server.authProvider.listUsers()).find(
    (user) => user.email === "user@example.com",
  );
  if (existingUser) return;

  await server.authProvider.createUser({
    email: "user@example.com",
    name: "Test User",
    password: "password123",
    role: "user",
  });
}

async function seedLocalDevUsers({ server }: ScreenshotFlowContext) {
  await seedLocalDevPresets({
    authProvider: server.authProvider,
    walksRepository: server.walksRepository,
  });
}

async function renderLoginError({ page, theme }: ScreenshotFlowContext) {
  await page.locator('input[name="email"]').fill("banned@example.com");
  await page.locator('input[name="password"]').fill(LOCAL_DEV_PASSWORD);
  await Promise.all([page.waitForSelector(".form-error"), page.click('button[type="submit"]')]);
  await setTheme(page, theme);
}

async function scrollScoresIntoView({ page }: ScreenshotFlowContext) {
  await page.evaluate(() => {
    const { document } = globalThis as unknown as BrowserGlobals;
    document.querySelector("#scores-heading")?.scrollIntoView({ block: "start" });
  });
}

async function scrollCommandResultsIntoView({ page }: ScreenshotFlowContext) {
  await page.evaluate(() => {
    const { document } = globalThis as unknown as BrowserGlobals;
    document.querySelector("#selection-command-input")?.scrollIntoView({ block: "start" });
  });
}

async function scrollStagedFormActionsIntoView({ page }: ScreenshotFlowContext) {
  await page.locator(".staged-form-actions").scrollIntoViewIfNeeded();
}

async function renderDemoInviteNotice({ page, theme }: ScreenshotFlowContext) {
  await page.locator("#admin-invite-email").fill(`review-${theme}@example.com`);
  await page.locator("#admin-invite-role").selectOption("user");
  await Promise.all([
    page.waitForSelector(".form-notice"),
    page.click('#invite-heading + form button[type="submit"]'),
  ]);
  await setTheme(page, theme);
}

async function renderConfirmClearAll({ page }: ScreenshotFlowContext) {
  await page.evaluate(() => {
    const { document } = globalThis as unknown as BrowserGlobals;
    document.querySelector("[data-pr-screenshot-confirm]")?.remove();

    const button = document.querySelector(".clear-walks-btn");
    const message = button?.getAttribute("hx-confirm") ?? "Clear all walks?";
    const isDark = document.documentElement.dataset.theme === "dark";
    const backdrop = document.createElement("div");
    const panel = document.createElement("div");
    const title = document.createElement("strong");
    const prompt = document.createElement("p");
    const actions = document.createElement("div");
    const cancel = document.createElement("button");
    const clear = document.createElement("button");

    backdrop.setAttribute("data-pr-screenshot-confirm", "true");
    backdrop.style.cssText = [
      "position: fixed",
      "inset: 0",
      "z-index: 2147483647",
      "display: grid",
      "place-items: center",
      "padding: 1.25rem",
      "background: rgb(0 0 0 / 0.48)",
    ].join(";");

    panel.style.cssText = [
      "width: min(20rem, 100%)",
      `background: ${isDark ? "#16191d" : "#f8f9fa"}`,
      `color: ${isDark ? "#f8f9fa" : "#212529"}`,
      "border-radius: 0.75rem",
      "box-shadow: 0 18px 45px rgb(0 0 0 / 0.35)",
      "padding: 1rem",
      "font: 500 1rem system-ui, sans-serif",
    ].join(";");

    title.textContent = "Confirm";
    title.style.cssText = "display: block; font-size: 1.15rem; margin-block-end: 0.5rem";

    prompt.textContent = message;
    prompt.style.cssText = "margin: 0 0 1rem";

    actions.style.cssText = "display: flex; justify-content: flex-end; gap: 0.5rem";

    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.style.cssText = [
      "border: 1px solid #adb5bd",
      "border-radius: 0.35rem",
      "background: transparent",
      `color: ${isDark ? "#f8f9fa" : "#212529"}`,
      "font-weight: 700",
      "padding: 0.45rem 0.65rem",
    ].join(";");

    clear.type = "button";
    clear.textContent = "Clear all";
    clear.style.cssText = [
      "border: 0",
      "border-radius: 0.35rem",
      "background: #c92a2a",
      "color: #f8f9fa",
      "font-weight: 700",
      "padding: 0.45rem 0.65rem",
    ].join(";");

    actions.append(cancel, clear);
    panel.append(title, prompt, actions);
    backdrop.append(panel);
    document.body.append(backdrop);
  });
  await page.waitForSelector("[data-pr-screenshot-confirm]");
}

async function openExampleMenu({ page }: ScreenshotFlowContext) {
  await page.getByRole("button", { name: "Open example menu" }).click();
  await page.waitForTimeout(120);
}

function getScreenshotFlow(flowId: string): ScreenshotFlow {
  const flow = screenshotFlows.find((candidate) => candidate.id === flowId);
  if (!flow) {
    throw new Error(
      `Unknown screenshot flow "${flowId}". Available flows:\n${listScreenshotFlows()}`,
    );
  }

  return flow;
}
