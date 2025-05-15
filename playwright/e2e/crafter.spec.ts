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
    await page.getByTestId("crafter-search").fill(item);
    await page.getByTestId("list-group-item").first().locator("button").click();
    await page.getByTestId("crafter-copy-clipboard").click();
    await expect(page.getByTestId("crafter-copy-clipboard")).toBeVisible();
  });
});
