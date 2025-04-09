import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

test.describe("Profile", () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage for logged-in user simulation
    await page.evaluate(() => {
      window.localStorage.setItem("token", "00000000000000000000000000000000");
    });

    await interceptRequests(page);
    await page.goto("/");

    await page.locator('[data-cy="profile-link"]').click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test("Should display user profile information", async ({ page }) => {
    await page.waitForResponse("**/users*");

    await expect(page.locator('[data-cy="profile-nickname"]')).toContainText(
      "Stiletto",
    );
    await expect(page.locator('[data-cy="profile-discord"]')).toContainText(
      "TEST#12345",
    );
  });

  test("Should allow editing profile information", async ({ page }) => {
    await page.waitForResponse("**/users*");

    await page.locator('[data-cy="edit-profile-btn"]').click();

    await expect(page.locator('[data-cy="profile-edit-form"]')).toBeVisible();

    const newNickname = "TestUser";
    await page.locator('[data-cy="profile-nickname-input"]').fill(""); // Clear first
    await page.locator('[data-cy="profile-nickname-input"]').fill(newNickname);

    await page.locator('[data-cy="save-profile-btn"]').click();

    await expect(
      page.locator('[data-cy="profile-update-success"]'),
    ).toBeVisible();
  });

  test("Should show user's clan information if in a clan", async ({ page }) => {
    // Setup route for user with clan
    await page.route("**/users*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          nickname: "Stiletto",
          discordtag: "TEST#12345",
          discordid: "000000000000",
          clanid: "clan123",
          clanname: "Test Clan",
          leaderid: null,
          serverdiscord: null,
        }),
      });
    });

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await page.waitForResponse("**/users*");

    await expect(page.locator('[data-cy="profile-clan"]')).toContainText(
      "Test Clan",
    );
  });

  test("Should allow user to leave a clan", async ({ page }) => {
    // Setup route for user with clan
    await page.route("**/users*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          nickname: "Stiletto",
          discordtag: "TEST#12345",
          discordid: "000000000000",
          clanid: "clan123",
          clanname: "Test Clan",
          leaderid: null,
          serverdiscord: null,
        }),
      });
    });

    // Setup route for leaving clan
    await page.route("**/clans/members/*", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await page.waitForResponse("**/users*");

    await page.locator('[data-cy="leave-clan-btn"]').click();

    await page.locator('[data-cy="confirm-leave-clan-btn"]').click();

    await page.waitForResponse(
      (response) =>
        response.url().includes("/clans/members/") &&
        response.request().method() === "DELETE",
    );

    await expect(page.locator('[data-cy="leave-clan-success"]')).toBeVisible();
  });

  test("Should show user's recipes", async ({ page }) => {
    await page.waitForResponse("**/users*");

    await page.locator('[data-cy="recipes-tab"]').click();

    await page.waitForResponse("**/recipes*");

    await expect(page.locator('[data-cy="user-recipes"]')).toBeVisible();
    await expect(page.locator('[data-cy="recipe-item"]')).toContainText(
      "Sand Bed",
    );
  });
});
