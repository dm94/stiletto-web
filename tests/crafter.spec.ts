import { test, expect } from "@playwright/test";
import { setupNetworkInterceptions, waitForPageLoad } from "./utils/fixtures";

const item = "Sand Bed";

test.describe("Crafter", () => {
  test.beforeEach(async ({ page }) => {
    // Set up all network interceptions
    await setupNetworkInterceptions(page);

    // Visit the initial page
    await page.goto("/");

    // Wait for the page to fully load
    await waitForPageLoad(page);

    // Navigate to the Crafter page
    await page.locator('[data-cy="crafter-link"]').click();

    // Verify we are on the correct page
    await expect(page).toHaveURL(/\/crafter/);
  });

  test("Should search and add an item", async ({ page }) => {
    // Search for an item
    const searchInput = page.locator('[data-cy="crafter-search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(item);
    await expect(searchInput).toHaveValue(item);

    // Add the item
    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    // Verify that the item has been added
    await expect(
      page.locator('[data-cy="selected-item"]').first(),
    ).toContainText(item);
  });

  test("Should add an item and share it", async ({ page }) => {
    // Search and add an item
    await page.locator('[data-cy="crafter-search"]').fill(item);
    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    // Verify that the item has been added
    await expect(
      page.locator('[data-cy="selected-item"]').first(),
    ).toContainText(item);

    // Share the item
    const responsePromise = page.waitForResponse("**/recipes*");
    await page.locator('[data-cy="share-crafter-btn"]').click();
    await responsePromise;

    // Verify that the share link has been generated
    await expect(page.locator('[data-cy="share-crafter-input"]')).toHaveValue(
      /63e00d26982e2b509d5cde92/,
    );
  });

  test("Should add an item several times and check the counter", async ({
    page,
  }) => {
    const count = 3;

    // Search for an item
    await page.locator('[data-cy="crafter-search"]').fill(item);

    // Add the item multiple times
    for (let i = 0; i < count; i++) {
      await page
        .locator('[data-cy="list-group-item"]')
        .first()
        .locator("button")
        .click();
    }

    // Verify the counter
    await expect(
      page
        .locator('[data-cy="selected-item"]')
        .first()
        .locator('input[type="number"]'),
    ).toHaveValue(String(count));
  });

  test("Should add an item and copy it", async ({ page, context }) => {
    // Grant permissions to access the clipboard
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Search and add an item
    await page.locator('[data-cy="crafter-search"]').fill(item);
    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    // Copy to clipboard
    await page.locator('[data-cy="crafter-copy-clipboard"]').click();

    // Verify clipboard content
    // Note: In Playwright, verifying clipboard is more complex and may require
    // a custom implementation depending on the browser
    // This is an approximation that may need adjustments
    const clipboardContent = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardContent).toContain(item);
  });

  test("Should remove an item when clicking the remove button", async ({
    page,
  }) => {
    // Search and add an item
    await page.locator('[data-cy="crafter-search"]').fill(item);
    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    // Verify that the item exists
    await expect(page.locator('[data-cy="selected-item"]')).toBeVisible();

    // Remove the item
    await page
      .locator('[data-cy="selected-item"]')
      .first()
      .locator('button[aria-label="Remove item"]')
      .click();

    // Verify that the item no longer exists
    await expect(page.locator('[data-cy="selected-item"]')).not.toBeVisible({
      timeout: 5000,
    });
  });
});
