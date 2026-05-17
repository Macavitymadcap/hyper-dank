import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { AdminScoresPanel } from "./AdminScoresPanel";

const user = {
  banned: false,
  email: "history@example.com",
  id: "history@example.com",
  name: "Long History",
  role: "user" as const,
};

describe("AdminScoresPanel", () => {
  test("renders read-only scores for the selected user", () => {
    const html = renderToString(
      <AdminScoresPanel
        selectedUser={user}
        selectedWalks={[]}
        selectedStats={{ avgSpeed: 3.2, count: 0, medianPace: 19.1 }}
      />,
    );

    expect(html).toContain("history@example.com");
    expect(html).toContain('<output class="labelled-output-value">3.2</output>');
    expect(html).not.toContain("Clear all");
  });

  test("renders an empty account state", () => {
    const html = renderToString(
      <AdminScoresPanel
        selectedWalks={[]}
        selectedStats={{ avgSpeed: 0, count: 0, medianPace: 0 }}
      />,
    );

    expect(html).toContain("No users available.");
  });
});
