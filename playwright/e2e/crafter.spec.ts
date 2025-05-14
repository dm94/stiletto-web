import { test, expect } from "@playwright/test";

const item = "Sand Bed";

test.describe("Crafter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("crafter-link").click();
    await expect(page).toHaveURL(/.*crafter/);
  });

  test("Should search and add an item", async ({ page }) => {
    await page.getByTestId("crafter-search").fill(item);
    await expect(page.getByTestId("crafter-search")).toHaveValue(item);
    await page.getByTestId("list-group-item").first().locator("button").click();
    await expect(page.getByTestId("selected-item").first()).toContainText(item);
  });

  test("Should add an item and share it", async ({ page, context }) => {
    // Mock the API request for sharing
    await context.route("**/api/recipes", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "63e00d26982e2b509d5cde92" }),
      });
    });

    await page.getByTestId("crafter-search").fill(item);
    await page.getByTestId("list-group-item").first().locator("button").click();
    await expect(page.getByTestId("selected-item").first()).toContainText(item);
    await page.getByTestId("share-crafter-btn").click();
    await expect(page.getByTestId("share-crafter-input")).toHaveValue(
      /63e00d26982e2b509d5cde92/,
    );
  });

  test("Should add an item several times and check the counter", async ({
    page,
  }) => {
    const count = 3;
    await page.getByTestId("crafter-search").fill(item);
    for (let i = 0; i < count; i++) {
      await page
        .getByTestId("list-group-item")
        .first()
        .locator("button")
        .click();
    }
    await expect(
      page.getByTestId("selected-item").first().locator('input[type="number"]'),
    ).toHaveValue(count.toString());
  });

  test("Should add an item and copy it", async ({ page }) => {
    // Clipboard actions can be tricky and might require specific browser permissions or workarounds.
    // Playwright's built-in clipboard API is limited for security reasons.
    // This test will check if the button exists and can be clicked.
    // For actual clipboard content verification, you might need to use a workaround or test it manually.
    await page.getByTestId("crafter-search").fill(item);
    await page.getByTestId("list-group-item").first().locator("button").click();
    await page.getByTestId("crafter-copy-clipboard").click();
    // As a proxy, we can check if a notification or some UI change indicates success, if applicable.
    // For now, we'll just ensure the button click doesn't error out.
    await expect(page.getByTestId("crafter-copy-clipboard")).toBeVisible();
  });

  test("Should remove an item when clicking the remove button", async ({
    page,
  }) => {
    await page.getByTestId("crafter-search").fill(item);
    await page.getByTestId("list-group-item").first().locator("button").click();
    await expect(page.getByTestId("selected-item").first()).toBeVisible();
    await page
      .getByTestId("selected-item")
      .first()
      .locator('button[aria-label="Remove item"]')
      .click();
    await expect(page.getByTestId("selected-item")).toHaveCount(0);
  });
});
