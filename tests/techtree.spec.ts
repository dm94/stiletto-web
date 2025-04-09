import { test, expect } from "@playwright/test";
import { interceptRequests } from "./support/fixtures";

test.describe("Tech Tree", () => {
  test.beforeEach(async ({ page }) => {
    await interceptRequests(page);
    await page.goto("/tech");
    await expect(page).toHaveURL(/\/tech/);
  });

  test("Should display the tech tree correctly", async ({ page }) => {
    await expect(page.locator('[data-cy="tech-tree-container"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-tree-title"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-nodes"]')).toBeVisible();
  });

  test("Should allow selecting different tech trees", async ({ page }) => {
    await page.locator('[data-cy="tech-tree-selector"]').selectOption("walker");
    await expect(page.locator('[data-cy="tech-tree-container"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-nodes"]')).toBeVisible();

    await page
      .locator('[data-cy="tech-tree-selector"]')
      .selectOption("station");
    await expect(page.locator('[data-cy="tech-tree-container"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-nodes"]')).toBeVisible();
  });

  test("Should display tech node details when clicking on a node", async ({
    page,
  }) => {
    await page.locator('[data-cy="tech-node"]').first().click();

    await expect(page.locator('[data-cy="tech-node-details"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-node-name"]')).toBeVisible();
    await expect(
      page.locator('[data-cy="tech-node-description"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-cy="tech-node-requirements"]'),
    ).toBeVisible();
  });

  test("Should highlight connected nodes when hovering over a node", async ({
    page,
  }) => {
    await page.locator('[data-cy="tech-node"]').first().hover();

    await expect(page.locator('[data-cy="tech-node-connected"]')).toHaveClass(
      /highlighted/,
    );
  });

  test("Should allow searching for specific technologies", async ({ page }) => {
    const searchTerm = "Firefly";
    await page.locator('[data-cy="tech-search"]').fill(searchTerm);
    await page.locator('[data-cy="tech-search-btn"]').click();

    await expect(page.locator('[data-cy="tech-search-results"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-search-result"]')).toContainText(
      searchTerm,
    );
  });

  test("Should allow calculating tech costs", async ({ page }) => {
    await page.locator('[data-cy="tech-node"]').first().click();
    await page.locator('[data-cy="calculate-cost-btn"]').click();

    await expect(page.locator('[data-cy="tech-cost-breakdown"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-cost-total"]')).toBeVisible();
    await expect(page.locator('[data-cy="tech-cost-items"]')).toBeVisible();
  });

  test("Should allow creating a tech path when logged in", async ({ page }) => {
    // Set localStorage for logged-in user simulation
    await page.evaluate(() => {
      window.localStorage.setItem("token", "00000000000000000000000000000000");
    });
    // Reload page to apply localStorage changes
    await page.reload();

    await page.locator('[data-cy="create-tech-path-btn"]').click();

    // In Playwright, we need to use keyboard modifiers differently
    await page.keyboard.down("Control");
    await page.locator('[data-cy="tech-node"]').nth(0).click();
    await page.locator('[data-cy="tech-node"]').nth(1).click();
    await page.locator('[data-cy="tech-node"]').nth(2).click();
    await page.keyboard.up("Control");

    await page.locator('[data-cy="save-tech-path-btn"]').click();
    await page.locator('[data-cy="tech-path-name-input"]').fill("My Test Path");
    await page.locator('[data-cy="confirm-save-path-btn"]').click();

    await expect(page.locator('[data-cy="path-saved-message"]')).toBeVisible();
  });
});
