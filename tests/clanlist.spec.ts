import { test, expect } from "@playwright/test";
import { setupNetworkInterceptions, waitForPageLoad } from "./utils/fixtures";

test.describe("Clan List", () => {
  test.beforeEach(async ({ page }) => {
    // Set up all network interceptions
    await setupNetworkInterceptions(page);

    // Visit the initial page
    await page.goto("/");

    // Wait for the page to fully load
    await waitForPageLoad(page);

    // Navigate to the clans page
    await page.locator('[data-cy="clan-link"]').click();

    // Verify we are on the correct page
    await expect(page).toHaveURL(/\/clans/);
  });

  test("Should display clan list", async ({ page }) => {
    // Verify that the clan list is displayed
    await expect(page.locator('[data-cy="clan-list"]')).toBeVisible();

    // Verify that there are items in the list
    const clanItems = page.locator('[data-cy="clan-item"]');
    await expect(clanItems).toHaveCount(3); // Assuming there are 3 clans in the fixture
  });

  test("Should filter clans by name", async ({ page }) => {
    // Search for a specific clan
    await page.locator('[data-cy="clan-search"]').fill("Clan");

    // Verify that the results are filtered
    const clanItems = page.locator('[data-cy="clan-item"]');
    await expect(clanItems).toBeVisible();

    // Verify that clan names contain the search text
    const names = await clanItems.allTextContents();
    for (const name of names) {
      expect(name.toLowerCase()).toContain("clan");
    }
  });

  test("Should navigate to clan details", async ({ page }) => {
    // Click on the first clan
    await page.locator('[data-cy="clan-item"]').first().click();

    // Verify that we navigate to the clan details page
    await expect(page).toHaveURL(/\/clan\/\d+/);

    // Verify that the clan details are displayed
    await expect(page.locator('[data-cy="clan-details"]')).toBeVisible();
  });
});
