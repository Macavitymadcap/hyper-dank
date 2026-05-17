import { expect, type Page, test } from "@playwright/test";
import { LOCAL_DEV_PASSWORD } from "../../src/envs/local/local-presets";

const userEmail = "empty@example.com";
const adminEmail = "admin@example.com";

test("redirects unauthenticated users and signs in through the browser", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill(LOCAL_DEV_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Walking Pace Tracker" })).toBeVisible();
  await expect(page.getByText(userEmail)).toBeVisible();
});

test("adds and clears walks through HTMX fragments", async ({ page }) => {
  await signIn(page, userEmail);
  await page.context().request.delete("/walks");
  await page.goto("/");

  await expect(page.getByText("No walks recorded yet")).toBeVisible();
  await page.getByRole("spinbutton", { exact: true, name: "Mi" }).fill("1.2");
  await page.getByRole("spinbutton", { exact: true, name: "Min" }).fill("18");
  await page.getByRole("spinbutton", { exact: true, name: "Sec" }).fill("55");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.locator("#walks-list")).toContainText("1 walk");
  await expect(page.locator("#walks-list")).toContainText("1.2");
  await expect(page.locator("#stats")).toContainText("3.8");
  await expect(page.locator("#stats")).toContainText("15.8");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { exact: true, name: "Clear" }).click();

  await expect(page.locator("#walks-list")).toContainText("No walks recorded yet");
  await expect(page.locator("#stats")).toContainText("--");
});

test("clears all walks and refreshes the stats fragment", async ({ page }) => {
  await signIn(page, userEmail);
  await page.context().request.delete("/walks");
  await page.goto("/");

  await addWalk(page, { miles: "1.0", minutes: "15", seconds: "0" }, "1 walk");
  await addWalk(page, { miles: "2.0", minutes: "30", seconds: "0" }, "2 walks");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear all" }).click();

  await expect(page.locator("#walks-list")).toContainText("No walks recorded yet");
  await expect(page.locator("#stats")).toContainText("--");
});

test("admin can review another user's scores without mutation controls", async ({ page }) => {
  await signIn(page, adminEmail);
  await page.goto("/admin?userId=history@example.com");

  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Scores" })).toBeVisible();
  await expect(page.getByText("history@example.com").first()).toBeVisible();
  await expect(page.locator("#admin-panel")).toContainText("Walk history");
  await expect(page.locator("#admin-panel").getByRole("button", { name: "Clear" })).toHaveCount(0);
  await expect(page.locator("#admin-panel").getByRole("button", { name: "Clear all" })).toHaveCount(
    0,
  );
});

async function signIn(page: Page, email: string) {
  const response = await page.context().request.post("/login", {
    form: {
      email,
      password: LOCAL_DEV_PASSWORD,
    },
  });

  expect(response.ok()).toBe(true);
}

async function addWalk(
  page: Page,
  walk: { miles: string; minutes: string; seconds: string },
  expectedCount: string,
) {
  await page.getByRole("spinbutton", { exact: true, name: "Mi" }).fill(walk.miles);
  await page.getByRole("spinbutton", { exact: true, name: "Min" }).fill(walk.minutes);
  await page.getByRole("spinbutton", { exact: true, name: "Sec" }).fill(walk.seconds);
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("#walks-list .history-count")).toHaveText(expectedCount);
}
