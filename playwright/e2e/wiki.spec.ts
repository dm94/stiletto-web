import { test, expect } from "@playwright/test";

const item = "Sand Bed";

test.describe("Wiki", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("wiki-link").click();
    await expect(page).toHaveURL(/.*wiki/);
  });

  test("Should search for an item", async ({ page }) => {
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .fill(item);
    await page.getByTestId("wiki-search").locator("button").click();
    await expect(page.locator(".flex.flex-wrap")).toContainText(item);
  });

  test("Should filter by category", async ({ page }) => {
    await page.locator("#category-filter").selectOption("Resources");
    await expect(page.locator(".flex.flex-wrap")).toContainText("Aloe");
    await expect(page.locator(".flex.flex-wrap")).toContainText("Wood");
    await expect(page.locator(".flex.flex-wrap")).not.toContainText(item);
  });

  test('Should show "Nothing found" when no items match the search', async ({
    page,
  }) => {
    const searchTerm = "NonExistentItem";
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .fill(searchTerm);
    await page.getByTestId("wiki-search").locator("button").click();
    await expect(page.getByText("Nothing found")).toBeVisible();
  });

  test("Should search when pressing Enter key", async ({ page }) => {
    const searchTerm = "Wood";
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .fill(searchTerm);
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .press("Enter");
    await expect(page.locator(".flex.flex-wrap")).toContainText("Wood");
  });

  test("Should combine search and category filter", async ({ page }) => {
    const searchTerm = "Wood";
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .fill(searchTerm);
    await page.getByTestId("wiki-search").locator("button").click();
    await page.locator("#category-filter").selectOption("Crafting");
    await expect(page.getByTestId("wiki-item").first()).toContainText(
      "Advanced Woodworking Station",
    );
  });
});
