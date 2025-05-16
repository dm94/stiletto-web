import { test, expect } from "@playwright/test";

const ITEM_NAME = "Fiber";
const ITEM_NAME_URL_ENCODED = "fiber";
const NON_EXISTENT_ITEM_NAME = "NonExistentItem123";

const Rarity = {
  Common: "common",
  Uncommon: "uncommon",
  Rare: "rare",
  Epic: "epic",
  Legendary: "legendary",
};

test.describe("ItemWiki Page", () => {
  test("Should load item page correctly and display item name", async ({
    page,
  }) => {
    await page.goto(`/item/${ITEM_NAME_URL_ENCODED}`);
    // Wait for the main container of the item page to be visible
    await expect(page.getByTestId("wiki-item")).toBeVisible({ timeout: 20000 });
    // Check if the item name is present in the h1 tag
    await expect(page.locator("h1")).toContainText(ITEM_NAME, {
      timeout: 10000,
    });
    // Check if the data-name attribute matches the item name
    await expect(page.getByTestId("wiki-item")).toHaveAttribute(
      "data-name",
      ITEM_NAME,
      { timeout: 10000 },
    );
  });

  test("Should change rarity and update URL and UI", async ({ page }) => {
    await page.goto(`/item/${ITEM_NAME_URL_ENCODED}`);
    await expect(page.getByTestId("wiki-item")).toBeVisible({ timeout: 20000 });

    const rarityToSelect = Rarity.Epic;

    const epicButton = page.getByTestId(`rarity-button-${rarityToSelect}`);
    await epicButton.click();

    await expect(page).toHaveURL(
      new RegExp(`/item/${ITEM_NAME_URL_ENCODED}/${rarityToSelect}`),
      { timeout: 10000 },
    );

    await expect(epicButton).toHaveAttribute("aria-pressed", "true", {
      timeout: 10000,
    });
  });

  test("Should redirect to wiki page if item does not exist", async ({
    page,
  }) => {
    await page.goto(`/item/${NON_EXISTENT_ITEM_NAME}`);
    // Expect redirection to the main wiki page
    await expect(page).toHaveURL(/.*\/wiki$/, { timeout: 15000 }); // Matches /wiki or /en/wiki etc.
    // Verify that the wiki search input is visible, indicating we are on the wiki page
    await expect(
      page.getByTestId("wiki-search").locator('input[type="search"]'),
    ).toBeVisible({ timeout: 10000 });
  });

  test("Should display common rarity by default if no rarity is specified in URL", async ({
    page,
  }) => {
    await page.goto(`/item/${ITEM_NAME_URL_ENCODED}`);
    await expect(page.getByTestId("wiki-item")).toBeVisible({ timeout: 20000 });

    const commonButton = page.getByTestId(`rarity-button-${Rarity.Common}`);
    await expect(commonButton).toHaveAttribute("aria-pressed", "true", {
      timeout: 10000,
    });
  });

  test("Should display specified rarity from URL correctly", async ({
    page,
  }) => {
    const specifiedRarity = Rarity.Legendary;
    await page.goto(`/item/${ITEM_NAME_URL_ENCODED}/${specifiedRarity}`);
    await expect(page.getByTestId("wiki-item")).toBeVisible({ timeout: 20000 });

    const legendaryButton = page.getByTestId(
      `rarity-button-${specifiedRarity}`,
    );
    await expect(legendaryButton).toHaveAttribute("aria-pressed", "true", {
      timeout: 10000,
    });
  });
});
