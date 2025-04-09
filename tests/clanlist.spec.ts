import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

test.describe("Clan List", () => {
  test.beforeEach(async ({ page }) => {
    await interceptRequests(page);
    await page.goto("/");
    await page.locator('[data-cy="clanlist-link"]').click();
    await expect(page).toHaveURL(/\/clans/);
  });

  test("Should load the clan list page", async ({ page }) => {
    // Wait for clans data to load
    await page.waitForResponse("**/clans*");

    await expect(page.locator("text=Clans")).toBeVisible();
    await expect(page.locator('[data-cy="clan-list"]')).toBeVisible();
  });

  test("Should display clan information correctly", async ({ page }) => {
    await page.waitForResponse("**/clans*");

    const firstClanItem = page.locator('[data-cy="clan-item"]').first();
    await expect(firstClanItem.locator('[data-cy="clan-name"]')).toBeVisible();
    await expect(
      firstClanItem.locator('[data-cy="clan-members"]'),
    ).toBeVisible();
    await expect(
      firstClanItem.locator('[data-cy="clan-leader"]'),
    ).toBeVisible();
  });

  test("Should allow searching for clans", async ({ page }) => {
    await page.waitForResponse("**/clans*");

    const searchTerm = "Test";
    await page.locator('[data-cy="clan-search"]').fill(searchTerm);

    await expect(page.locator('[data-cy="clan-item"]')).toHaveCount({ min: 1 });
    await expect(page.locator('[data-cy="clan-name"]').first()).toContainText(
      searchTerm,
    );
  });

  test("Should allow sorting clans", async ({ page }) => {
    await page.waitForResponse("**/clans*");

    await page.locator('[data-cy="sort-by-name"]').click();

    // In Playwright, we need to get the text content of elements and compare them
    const clanNames = await page
      .locator('[data-cy="clan-name"]')
      .allTextContents();
    const sortedNames = [...clanNames].sort((a, b) => a.localeCompare(b));
    expect(clanNames).toEqual(sortedNames);
  });

  test("Should allow viewing clan details", async ({ page }) => {
    await page.waitForResponse("**/clans*");

    await page.locator('[data-cy="clan-item"]').first().click();

    await expect(page).toHaveURL(/\/clan\//);
    await expect(page.locator('[data-cy="clan-details"]')).toBeVisible();
    await expect(page.locator('[data-cy="clan-members-list"]')).toBeVisible();
  });

  test("Should show empty state when no clans match search", async ({
    page,
  }) => {
    await page.waitForResponse("**/clans*");

    await page.locator('[data-cy="clan-search"]').fill("NonExistentClan123456");

    await expect(page.locator('[data-cy="no-clans-found"]')).toBeVisible();
  });

  test("Should allow creating a new clan", async ({ page }) => {
    // Setup route for creating a new clan
    await page.route("**/clans", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "newclan123",
            name: "New Test Clan",
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('[data-cy="create-clan-btn"]').click();

    await page.locator('[data-cy="clan-name-input"]').fill("New Test Clan");
    await page.locator('[data-cy="clan-tag-input"]').fill("NTC");

    await page.locator('[data-cy="submit-clan-btn"]').click();

    // Wait for the request to complete
    await page.waitForResponse(
      (response) =>
        response.url().includes("/clans") && response.status() === 201,
    );

    await expect(
      page.locator('[data-cy="clan-created-success"]'),
    ).toBeVisible();
  });
});
