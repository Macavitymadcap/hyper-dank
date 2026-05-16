import { setTimeout as delay } from "node:timers/promises";
import type { Page } from "puppeteer";
import { LOCAL_DEV_PASSWORD, seedLocalDevPresets } from "../../src/envs/local/local-presets";
import {
  addWalk as addServerWalk,
  clearWalks as clearServerWalks,
  type InMemoryAppServer,
  type SampleWalk,
} from "./app-server";
import type { Theme } from "./pr-images";

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
  await page.evaluate((selectedTheme) => {
    const browser = globalThis as unknown as BrowserGlobals;
    const document = browser.document;

    browser.localStorage.setItem("pace-calculator-theme", selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle instanceof browser.HTMLInputElement) {
      const isDark = selectedTheme === "dark";
      toggle.checked = isDark;
      toggle.setAttribute("aria-checked", String(isDark));
    }
  }, theme);
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
  await page.type('input[name="email"]', "banned@example.com");
  await page.type('input[name="password"]', LOCAL_DEV_PASSWORD);
  await Promise.all([page.waitForSelector(".form-error"), page.click('button[type="submit"]')]);
  await setTheme(page, theme);
}

async function scrollScoresIntoView({ page }: ScreenshotFlowContext) {
  await page.evaluate(() => {
    const { document } = globalThis as unknown as BrowserGlobals;
    document.querySelector("#scores-heading")?.scrollIntoView({ block: "start" });
  });
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

function getScreenshotFlow(flowId: string): ScreenshotFlow {
  const flow = screenshotFlows.find((candidate) => candidate.id === flowId);
  if (!flow) {
    throw new Error(
      `Unknown screenshot flow "${flowId}". Available flows:\n${listScreenshotFlows()}`,
    );
  }

  return flow;
}
