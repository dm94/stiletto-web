import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

const item = "Sand Bed";

test.describe("Crafter", () => {
  test.beforeEach(async ({ page }) => {
    await interceptRequests(page);
    await page.goto("/");
    await page.locator('[data-cy="crafter-link"]').click();
    await expect(page).toHaveURL(/\/crafter/);
  });

  test("Should search and add an item", async ({ page }) => {
    await expect(page.locator('[data-cy="crafter-search"]')).toBeVisible();
    await page.locator('[data-cy="crafter-search"]').fill(item);
    await expect(page.locator('[data-cy="crafter-search"]')).toHaveValue(item);

    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    await expect(
      page.locator('[data-cy="selected-item"]').first(),
    ).toContainText(item);
  });

  test("Should add an item and share it", async ({ page }) => {
    await expect(page.locator('[data-cy="crafter-search"]')).toBeVisible();
    await page.locator('[data-cy="crafter-search"]').fill(item);

    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    await expect(
      page.locator('[data-cy="selected-item"]').first(),
    ).toContainText(item);

    await page.locator('[data-cy="share-crafter-btn"]').click();

    await page.waitForResponse("**/recipes*");

    await expect(page.locator('[data-cy="share-crafter-input"]')).toHaveValue(
      /63e00d26982e2b509d5cde92/,
    );
  });

  test("Should add an item several times and check the counter", async ({
    page,
  }) => {
    const count = 3;

    await expect(page.locator('[data-cy="crafter-search"]')).toBeVisible();
    await page.locator('[data-cy="crafter-search"]').fill(item);

    for (let i = 0; i < count; i++) {
      await page
        .locator('[data-cy="list-group-item"]')
        .first()
        .locator("button")
        .click();
    }

    await expect(
      page
        .locator('[data-cy="selected-item"]')
        .first()
        .locator('input[type="number"]'),
    ).toHaveValue(String(count));
  });

  test("Should add an item and copy it", async ({ page }) => {
    await expect(page.locator('[data-cy="crafter-search"]')).toBeVisible();
    await page.locator('[data-cy="crafter-search"]').fill(item);

    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    // In Playwright, we need to grant clipboard permissions and use a different approach
    // for checking clipboard content
    await page
      .context()
      .grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.locator('[data-cy="crafter-copy-clipboard"]').click();

    // Read clipboard content
    const clipboardContent = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardContent).toContain(item);
  });

  test("Should remove an item when clicking the remove button", async ({
    page,
  }) => {
    await expect(page.locator('[data-cy="crafter-search"]')).toBeVisible();
    await page.locator('[data-cy="crafter-search"]').fill(item);

    await page
      .locator('[data-cy="list-group-item"]')
      .first()
      .locator("button")
      .click();

    await expect(page.locator('[data-cy="selected-item"]')).toBeVisible();

    await page
      .locator('[data-cy="selected-item"]')
      .first()
      .locator('button[aria-label="Remove item"]')
      .click();

    await expect(page.locator('[data-cy="selected-item"]')).not.toBeVisible();
  });
});
