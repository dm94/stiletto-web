import { test, expect } from "@playwright/test";

const item = "Sand Bed";

test.describe("Wiki", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("wiki-link").click();
    // Wait for a known element that indicates the page is ready
    await expect(
      page.getByTestId("wiki-search").locator('input[type="search"]'),
    ).toBeVisible();
    await expect(page).toHaveURL(/.*wiki/);
  });

  test("Should search for an item", async ({ page }) => {
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .fill(item);
    await page.getByTestId("wiki-search").locator("button").click();
    // Wait for the results container to contain the item text
    await expect(page.getByTestId("wiki-content-area")).toContainText(item, {
      timeout: 10000,
    });
  });

  test("Should filter by category", async ({ page }) => {
    await page.getByLabel("Filter by category").selectOption("Resources");
    // Wait for specific items to appear/disappear
    await expect(page.getByTestId("wiki-content-area")).toContainText("Aloe", {
      timeout: 10000,
    });
    await expect(page.getByTestId("wiki-content-area")).toContainText("Wood", {
      timeout: 10000,
    });
    await expect(page.getByTestId("wiki-content-area")).not.toContainText(
      item,
      {
        timeout: 10000,
      },
    );
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
    // Use toPass for robustness
    await expect(async () => {
      const nothingFoundElement = page.getByTestId("wiki-nothing-found");
      await expect(nothingFoundElement).toBeVisible({ timeout: 10000 }); // Shorter timeout for visibility
      await expect(nothingFoundElement).toContainText(/Nothing found/i);
    }).toPass({ timeout: 20000 }); // Overall timeout for the toPass block
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
    // Use toPass for robustness
    await expect(async () => {
      await expect(
        page
          .getByTestId("wiki-item")
          .filter({ hasText: new RegExp(searchTerm, "i") })
          .first(),
      ).toBeVisible();
    }).toPass({ timeout: 15000 });
  });

  test("Should combine search and category filter", async ({ page }) => {
    const searchTerm = "Wood";
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .fill(searchTerm);
    await page.getByTestId("wiki-search").locator("button").click();

    // Wait for initial search results
    await expect(async () => {
      await expect(
        page
          .getByTestId("wiki-item")
          .filter({ hasText: new RegExp(searchTerm, "i") })
          .first(),
      ).toBeVisible();
    }).toPass({ timeout: 15000 });

    await page.getByLabel("Filter by category").selectOption("Crafting");

    // Wait for combined results
    await expect(async () => {
      // Check if an item with "Advanced Woodworking Station" exists in the results
      await expect(
        page
          .getByTestId("wiki-item")
          .filter({ hasText: /Advanced Woodworking Station/i }),
      ).toBeVisible();
    }).toPass({ timeout: 15000 });
  });
});
