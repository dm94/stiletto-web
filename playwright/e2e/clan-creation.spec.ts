import { test, expect } from "@playwright/test";
import type { CreateClanRequestParams } from "../../src/types/dto/clan";

const MOCK_USER_DATA = {
  discordtag: "testUser#1234",
  nickname: "TestNickname",
};

const MOCK_CLAN_DATA = {
  clanname: "Test Clan",
  clancolor: "#FF5500",
  clandiscord: "testinvite",
  symbol: "C1",
  region: "EU-Official",
  recruit: true,
};

test.describe("Clan Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock user authentication
    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER_DATA),
      });
    });

    // Mock clan creation API endpoint
    await page.route("**/clans*", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Clan created successfully",
            id: 123,
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock clusters data for region dropdown
    await page.route("**/clusters", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            region: "EU",
            name: "Official",
            clan_limit: 999,
            crossplay: true,
          },
          {
            region: "NA",
            name: "Official",
            clan_limit: 999,
            crossplay: true,
          },
        ]),
      });
    });

    // Set authentication in localStorage
    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mock-test-token");
      window.localStorage.setItem("discordid", "mock-discord-id");
    });

    // Navigate to profile page
    await page.goto("/profile");
    await expect(page.getByTestId("discord-tag")).toBeVisible({ timeout: 15000 });
  });

  test("Should open clan creation modal and create a clan", async ({
    page,
  }) => {
    // Verify user is logged in
    await expect(page.getByTestId("discord-tag")).toHaveText(
      MOCK_USER_DATA.discordtag,
      { timeout: 15000 },
    );

    // Capture the POST request to /clans
    await page.route("**/clans**", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Clan created successfully",
            id: 123,
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Click on "Create a clan" button
    await page.getByText("Create a clan").click();

    // Verify clan configuration modal is visible
    await expect(page.getByText("Clan Configuration")).toBeVisible({
      timeout: 5000,
    });

    // Fill the clan creation form
    await page.locator("#clan_name").fill(MOCK_CLAN_DATA.clanname);

    const recruitCheckbox = page.locator("#recruitmentInput");
    if (!(await recruitCheckbox.isChecked())) {
      await recruitCheckbox.check();
    }

    await page.locator("#discord_invite").fill(MOCK_CLAN_DATA.clandiscord);

    await page
      .getByRole("button", { name: "Clan symbol C1", exact: true })
      .click();

    // Submit the form
    await page.getByTestId("submit-button").click();

    await expect(page.getByText("Clan Configuration")).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("Should validate required fields in clan creation form", async ({
    page,
  }) => {
    // Click on "Create a clan" button
    await page.getByText("Create a clan").click();

    // Verify clan configuration modal is visible
    await expect(page.getByText("Clan Configuration")).toBeVisible({
      timeout: 5000,
    });

    // Try to submit the form without filling required fields
    await page.locator("#clan_name").fill(""); // Clear the clan name field
    await page.locator("form#clanconfig button[type=submit]").click();

    // Form should still be visible as submission should fail due to validation
    await expect(page.getByText("Clan Configuration")).toBeVisible();

    // Verify the form validation is working (HTML5 validation)
    await expect(page.locator("#clan_name:invalid")).toBeVisible();

    // Fill the required field and try again
    await page.locator("#clan_name").fill(MOCK_CLAN_DATA.clanname);
    await page.locator("form#clanconfig button[type=submit]").click();

    // Verify modal is closed after successful submission
    await expect(page.getByText("Clan Configuration")).not.toBeVisible({
      timeout: 5000,
    });
  });
});
