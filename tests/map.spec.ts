import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

test.describe("Map", () => {
  test.beforeEach(async ({ page }) => {
    await interceptRequests(page);
    await page.goto("/");
    await page.locator('[data-cy="map-link"]').click();
    await expect(page).toHaveURL(/\/map/);
  });

  test("Should load the map page", async ({ page }) => {
    // Wait for map data to load
    await page.waitForResponse("**/maps");

    await expect(page.locator("text=Maps")).toBeVisible();
    await expect(page.locator('[data-cy="map-container"]')).toBeVisible();
  });

  test("Should display map resources", async ({ page }) => {
    // Wait for map and resources data to load
    await page.waitForResponse("**/maps");
    await page.waitForResponse("**/maps/*/resources*");

    await expect(page.locator('[data-cy="map-resources"]')).toBeVisible();
    await expect(page.locator('[data-cy="resource-marker"]')).toHaveCount({
      min: 1,
    });
  });

  test("Should allow adding a new resource to the map", async ({ page }) => {
    await page.waitForResponse("**/maps");

    await page.locator('[data-cy="add-resource-btn"]').click();

    await page.locator('[data-cy="resource-type-select"]').selectOption("Aloe");
    await page.locator('[data-cy="resource-quantity-input"]').fill("5");
    await page.locator('[data-cy="resource-coordinates-x"]').fill("100");
    await page.locator('[data-cy="resource-coordinates-y"]').fill("200");

    await page.locator('[data-cy="submit-resource-btn"]').click();

    // Wait for the request to complete
    await page.waitForResponse("**/maps/*/resources*");

    await expect(
      page.locator('[data-cy="resource-added-success"]'),
    ).toBeVisible();
  });

  test("Should allow removing a resource from the map", async ({ page }) => {
    await page.waitForResponse("**/maps");
    await page.waitForResponse("**/maps/*/resources*");

    await page.locator('[data-cy="resource-marker"]').first().click();

    await page.locator('[data-cy="delete-resource-btn"]').click();

    await page.locator('[data-cy="confirm-delete-resource-btn"]').click();

    // Wait for the delete request to complete
    const deletePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/maps/") &&
        response.url().includes("/resources") &&
        response.status() === 204,
    );
    await deletePromise;

    await expect(
      page.locator('[data-cy="resource-deleted-success"]'),
    ).toBeVisible();
  });

  test("Should allow adding a new map", async ({ page }) => {
    // Setup route for adding a new map
    await page.route("**/maps", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "newmap123",
            name: "New Test Map",
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('[data-cy="add-map-btn"]').click();

    await page.locator('[data-cy="map-name-input"]').fill("New Test Map");
    await page
      .locator('[data-cy="map-description-input"]')
      .fill("This is a test map");

    // Handle file upload - in Playwright we need a different approach
    // This assumes there's a file input element
    await page.setInputFiles(
      '[data-cy="map-image-input"]',
      "cypress/fixtures/map.jpg",
    );

    await page.locator('[data-cy="submit-map-btn"]').click();

    // Wait for the request to complete
    await page.waitForResponse(
      (response) =>
        response.url().includes("/maps") && response.status() === 201,
    );

    await expect(page.locator('[data-cy="map-added-success"]')).toBeVisible();
  });

  test("Should allow switching between maps", async ({ page }) => {
    await page.waitForResponse("**/maps");

    await expect(page.locator('[data-cy="map-selector"]')).toBeVisible();

    // Select the second option (index 1)
    await page.locator('[data-cy="map-selector"]').selectOption({ index: 1 });

    await page.waitForResponse("**/maps/*/resources*");

    await expect(page.locator('[data-cy="current-map-name"]')).not.toBeEmpty();
  });

  test("Should allow filtering resources by type", async ({ page }) => {
    await page.waitForResponse("**/maps");
    await page.waitForResponse("**/maps/*/resources*");

    await expect(page.locator('[data-cy="resource-filter"]')).toBeVisible();

    await page.locator('[data-cy="resource-filter"]').selectOption("Aloe");

    // Check that the filtered resources are displayed correctly
    // This might need adjustment based on how the UI actually responds to filtering
    await expect(
      page.locator('[data-cy="resource-marker"][data-resource="Aloe"]'),
    ).toBeVisible();
  });
});
