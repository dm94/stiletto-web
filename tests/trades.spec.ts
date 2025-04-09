import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

test.describe("Trades", () => {
  test.beforeEach(async ({ page }) => {
    await interceptRequests(page);
    await page.goto("/");
    await page.locator('[data-cy="trades-link"]').click();
    await expect(page).toHaveURL(/\/trades/);
  });

  test("Should load the trades page", async ({ page }) => {
    await page.waitForResponse("**/trades*");

    await expect(page.locator("text=Trades")).toBeVisible();
    await expect(page.locator('[data-cy="trade-list"]')).toBeVisible();
  });

  test("Should display trade information correctly", async ({ page }) => {
    await page.waitForResponse("**/trades*");

    const firstTradeItem = page.locator('[data-cy="trade-item"]').first();
    await expect(
      firstTradeItem.locator('[data-cy="trade-card"]'),
    ).toBeVisible();
    await expect(
      firstTradeItem.locator('[data-cy="trade-resource"]'),
    ).toBeVisible();
    await expect(
      firstTradeItem.locator('[data-cy="trade-price"]'),
    ).toBeVisible();
  });

  test("Should allow searching for trades", async ({ page }) => {
    await page.waitForResponse("**/trades*");

    await page.locator('[data-cy="resource-type-filter"]').selectOption("Wood");

    await expect(page.locator('[data-cy="trade-item"]')).toHaveCount({
      min: 1,
    });
  });

  test("Should allow filtering trades by type", async ({ page }) => {
    await page.waitForResponse("**/trades*");

    await page.locator('[data-cy="trade-type-filter"]').selectOption("Supply");

    await expect(page.locator('[data-cy="trade-item"]')).toHaveCount({
      min: 1,
    });
  });

  test("Should allow filtering trades by region", async ({ page }) => {
    await page.waitForResponse("**/trades*");

    await page.locator('[data-cy="region-filter"]').selectOption("EU");

    await expect(page.locator('[data-cy="trade-item"]')).toHaveCount({
      min: 1,
    });
  });

  test("Should allow pagination of trades", async ({ page }) => {
    await page.waitForResponse("**/trades*");

    await expect(page.locator('[data-cy="pagination"]')).toBeVisible();

    // Check if there are multiple pagination buttons
    const paginationButtons = page.locator('[data-cy="pagination"] button');
    const count = await paginationButtons.count();

    if (count > 1) {
      await paginationButtons.nth(1).click();
      await page.waitForResponse("**/trades*");
    }
  });

  test("Should show form to create a trade when logged in", async ({
    page,
  }) => {
    // Set localStorage for logged-in user simulation
    await page.evaluate(() => {
      window.localStorage.setItem("token", "00000000000000000000000000000000");
    });

    // Reload page to apply localStorage changes
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForResponse("**/trades*");

    await expect(page.locator("text=Publish a trade")).toBeVisible();
    await expect(page.locator('[data-cy="trade-type"]')).toBeVisible();
    await expect(page.locator('[data-cy="resource-type"]')).toBeVisible();
  });

  test("Should create a new trade when form is submitted", async ({ page }) => {
    // Set localStorage for logged-in user simulation
    await page.evaluate(() => {
      window.localStorage.setItem("token", "00000000000000000000000000000000");
    });

    // Setup route for creating a new trade
    await page.route("**/trades", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "newtrade123",
            resource: "Wood",
            type: "Supply",
            amount: "5",
            region: "EU",
            quality: "0",
            price: "100",
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Reload page to apply localStorage changes
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForResponse("**/trades*");

    await page.locator('[data-cy="trade-type"]').selectOption("Supply");
    await page.locator('[data-cy="resource-type"]').selectOption("Wood");
    await page.locator('[data-cy="region-input"]').selectOption("EU");
    await page.locator('[data-cy="amount-input"]').fill(""); // Clear first
    await page.locator('[data-cy="amount-input"]').fill("5");
    await page.locator('[data-cy="quality-input"]').fill(""); // Clear first
    await page.locator('[data-cy="quality-input"]').fill("0");
    await page.locator('[data-cy="price-input"]').fill(""); // Clear first
    await page.locator('[data-cy="price-input"]').fill("100");

    await page
      .locator('[data-cy="create-trade-form"]')
      .evaluate((form) => form.submit());

    // Wait for the POST request and then the subsequent GET request
    await page.waitForResponse(
      (response) =>
        response.url().includes("/trades") &&
        response.request().method() === "POST",
    );
    await page.waitForResponse("**/trades*");
  });

  test("Should allow deleting a trade when user is the owner", async ({
    page,
  }) => {
    // Set localStorage for logged-in user simulation
    await page.evaluate(() => {
      window.localStorage.setItem("token", "00000000000000000000000000000000");
    });

    // Setup route for getting trades with owner
    await page.route("**/trades*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              idtrade: "123",
              resource: "Wood",
              type: "Supply",
              amount: "5",
              region: "EU",
              quality: "0",
              price: "100",
              discordid: "00000000000000000000000000000000",
              discordtag: "user#1234",
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });

    // Setup route for deleting a trade
    await page.route("**/trades/123", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });

    // Reload page to apply localStorage changes
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForResponse("**/trades*");

    await expect(page.locator('[data-cy="delete-trade-btn"]')).toBeVisible();

    await page.locator('[data-cy="delete-trade-btn"]').click();

    // Wait for the DELETE request and then the subsequent GET request
    await page.waitForResponse(
      (response) =>
        response.url().includes("/trades/123") &&
        response.request().method() === "DELETE",
    );
    await page.waitForResponse("**/trades*");
  });
});
