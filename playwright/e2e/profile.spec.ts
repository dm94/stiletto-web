import { test, expect } from "@playwright/test";

const MOCK_USER_DATA = {
  discordtag: "testUser#1234",
  nickname: "TestNickname",
};

test.describe("Profile Page", () => {
  test("Should display user information when logged in", async ({ page }) => {
    const userApiResponsePromise = page.waitForResponse("**/users");

    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER_DATA),
      });
    });

    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mock-test-token");
    });

    await page.goto("/profile");

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    const response = await userApiResponsePromise;
    expect(response.ok()).toBe(true);

    expect(page.url()).toContain("/profile");
    expect(page.url()).not.toContain("/login");
    await expect(page.getByTestId("discord-tag")).toHaveText(
      MOCK_USER_DATA.discordtag,
      {
        timeout: 15000,
      },
    );

    await expect(page.getByText(MOCK_USER_DATA.nickname)).toBeVisible({
      timeout: 15000,
    });
  });
});
