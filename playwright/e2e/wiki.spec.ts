import { test, expect, type Page } from "@playwright/test";

const item = "Sand Bed";

// Helper function to search for an item
async function searchForItem(
  page: Page,
  searchTerm: string,
  pressEnter = false,
) {
  await page
    .getByTestId("wiki-search")
    .locator('input[type="search"]')
    .fill(searchTerm);
  if (pressEnter) {
    await page
      .getByTestId("wiki-search")
      .locator('input[type="search"]')
      .press("Enter");
  } else {
    await page.getByTestId("wiki-search").locator("button").click();
  }
}

// Helper function to filter by category
async function filterByCategory(page: Page, category: string) {
  await page.getByLabel("Filter by category").selectOption(category);
}

// Helper function to expect an item in the content area
async function expectItemInContentArea(page: Page, itemName: string) {
  await expect(page.getByTestId("wiki-content-area")).toContainText(itemName, {
    timeout: 15000, // Increased timeout for robustness
  });
}

// Helper function to expect an item NOT in the content area
async function expectItemNotInContentArea(page: Page, itemName: string) {
  await expect(page.getByTestId("wiki-content-area")).not.toContainText(
    itemName,
    {
      timeout: 15000, // Increased timeout for robustness
    },
  );
}

// Helper function to expect the "Nothing found" message
async function expectNothingFound(page: Page) {
  const nothingFoundElement = page.getByTestId("wiki-nothing-found");
  await expect(nothingFoundElement).toBeVisible({ timeout: 15000 });
  await expect(nothingFoundElement).toContainText(/Nothing found/i);
}

// Helper function to expect a specific wiki item to be visible
async function expectWikiItemVisible(
  page: Page,
  itemNamePattern: RegExp | string,
) {
  const itemLocator =
    typeof itemNamePattern === "string"
      ? page
          .getByTestId("wiki-item")
          .filter({ hasText: new RegExp(itemNamePattern, "i") })
      : page.getByTestId("wiki-item").filter({ hasText: itemNamePattern });
  await expect(itemLocator.first()).toBeVisible({ timeout: 20000 }); // Increased timeout
}

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
    await searchForItem(page, item);
    await expectItemInContentArea(page, item);
  });

  test("Should filter by category", async ({ page }) => {
    await filterByCategory(page, "Resources");
    await expectItemInContentArea(page, "Aloe");
    await expectItemInContentArea(page, "Wood");
    await expectItemNotInContentArea(page, item);
  });

  test('Should show "Nothing found" when no items match the search', async ({
    page,
  }) => {
    const searchTerm = "NonExistentItem";
    await searchForItem(page, searchTerm);
    await expectNothingFound(page);
  });

  test("Should search when pressing Enter key", async ({ page }) => {
    const searchTerm = "Wood";
    await searchForItem(page, searchTerm, true);
    await expectWikiItemVisible(page, searchTerm);
  });

  test("Should combine search and category filter", async ({ page }) => {
    const searchTerm = "Wood";
    await searchForItem(page, searchTerm);
    await expectWikiItemVisible(page, searchTerm);

    await filterByCategory(page, "Crafting");

    // Check if an item with "Advanced Woodworking Station" exists in the results
    // and also that the original search term "Wood" is still relevant (e.g. part of the item name)
    await expectWikiItemVisible(page, /Advanced Woodworking Station/i);
    // Optionally, ensure the item found also matches the search term if that's the desired behavior
    // For example, if "Advanced Woodworking Station" should contain "Wood"
    const advancedWoodworkingStation = page
      .getByTestId("wiki-item")
      .filter({ hasText: /Advanced Woodworking Station/i });
    await expect(advancedWoodworkingStation).toContainText(searchTerm, {
      timeout: 15000,
    });
  });
});
