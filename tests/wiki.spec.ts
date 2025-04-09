import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

test.describe("Wiki", () => {
  test.beforeEach(async ({ page }) => {
    await interceptRequests(page);
    await page.goto("/");
    await page.locator('[data-cy="wiki-link"]').click();
    await expect(page).toHaveURL(/\/wiki/);
  });

  test("Should load the wiki page", async ({ page }) => {
    await expect(page.locator("text=Last Oasis Wiki")).toBeVisible();
    await expect(page.locator('[data-cy="wiki-search"]')).toBeVisible();
    await expect(page.locator("#category-filter")).toBeVisible();
  });

  test("Should search for an item", async ({ page }) => {
    const searchTerm = "Sand";

    await page
      .locator('[data-cy="wiki-search"] input[type="search"]')
      .fill(searchTerm);
    await page.locator('[data-cy="wiki-search"] button').click();

    await expect(page.locator(".flex.flex-wrap")).toContainText("Sand Bed");
  });

  test("Should filter by category", async ({ page }) => {
    await page.locator("#category-filter").selectOption("Resources");

    await expect(page.locator(".flex.flex-wrap")).toContainText("Aloe");
    await expect(page.locator(".flex.flex-wrap")).toContainText("Wood");
    await expect(page.locator(".flex.flex-wrap")).not.toContainText("Sand Bed");
  });

  test("Should show 'Nothing found' when no items match the search", async ({
    page,
  }) => {
    const searchTerm = "NonExistentItem";

    await page
      .locator('[data-cy="wiki-search"] input[type="search"]')
      .fill(searchTerm);
    await page.locator('[data-cy="wiki-search"] button').click();

    await expect(page.locator("text=Nothing found")).toBeVisible();
  });

  test("Should search when pressing Enter key", async ({ page }) => {
    const searchTerm = "Wood";

    await page
      .locator('[data-cy="wiki-search"] input[type="search"]')
      .fill(searchTerm);
    await page
      .locator('[data-cy="wiki-search"] input[type="search"]')
      .press("Enter");

    await expect(page.locator(".flex.flex-wrap")).toContainText("Wood");
  });

  test("Should combine search and category filter", async ({ page }) => {
    const searchTerm = "Wood";

    await page
      .locator('[data-cy="wiki-search"] input[type="search"]')
      .fill(searchTerm);
    await page.locator('[data-cy="wiki-search"] button').click();

    await page.locator("#category-filter").selectOption("Crafting");

    await expect(page.locator('[data-cy="wiki-item"]').first()).toContainText(
      "Advanced Woodworking Station",
    );
  });
});
