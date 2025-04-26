import { test, expect } from "@playwright/test";
import { setupNetworkInterceptions, waitForPageLoad } from "./utils/fixtures";

test.describe("Map", () => {
  test.beforeEach(async ({ page }) => {
    // Set up all network interceptions
    await setupNetworkInterceptions(page);

    // Visit the initial page
    await page.goto("/");

    // Wait for the page to fully load
    await waitForPageLoad(page);

    // Navigate to the maps page
    await page.locator('[data-cy="map-link"]').click();

    // Verify we are on the correct page
    await expect(page).toHaveURL(/\/maps/);
  });

  test("Should display map list", async ({ page }) => {
    // Verify that the map list is displayed
    await expect(page.locator('[data-cy="map-list"]')).toBeVisible();

    // Verify that there are items in the list
    const mapItems = page.locator('[data-cy="map-item"]');
    await expect(mapItems).toBeVisible();
  });

  test("Should navigate to map details", async ({ page }) => {
    // Click on the first map
    await page.locator('[data-cy="map-item"]').first().click();

    // Verify that we navigate to the map details page
    await expect(page).toHaveURL(/\/maps\/\d+/);

    // Verify that the map is displayed
    await expect(page.locator('[data-cy="resource-map"]')).toBeVisible();
  });

  test("Should add a new resource to map", async ({ page }) => {
    // Navigate to map details
    await page.locator('[data-cy="map-item"]').first().click();

    // Wait for the map to load
    await expect(page.locator('[data-cy="resource-map"]')).toBeVisible();

    // Click on the button to add a resource
    await page.locator('[data-cy="add-resource-btn"]').click();

    // Fill out the form
    await page.locator('[data-cy="resource-type-select"]').selectOption("Aloe");
    await page.locator('[data-cy="resource-quality-input"]').fill("100");
    await page
      .locator('[data-cy="resource-size-select"]')
      .selectOption("medium");

    // Click on the map to place the resource
    await page.locator('[data-cy="resource-map"]').click();

    // Confirm adding the resource
    const responsePromise = page.waitForResponse("**/maps/*/resources*");
    await page.locator('[data-cy="confirm-add-resource"]').click();
    await responsePromise;

    // Verify that the resource has been added
    await expect(page.locator('[data-cy="resource-marker"]')).toBeVisible();
  });

  test("Should filter resources by type", async ({ page }) => {
    // Navigate to map details
    await page.locator('[data-cy="map-item"]').first().click();

    // Wait for the map to load
    await expect(page.locator('[data-cy="resource-map"]')).toBeVisible();

    // Filter by resource type
    await page.locator('[data-cy="filter-resource-type"]').selectOption("Aloe");

    // Verify that resources are filtered
    const visibleResources = page.locator(
      '[data-cy="resource-marker"]:visible',
    );
    await expect(visibleResources).toBeVisible();
  });
});
