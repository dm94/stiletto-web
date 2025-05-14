import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Should display the main title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Last Oasis Stiletto/i }),
    ).toBeVisible();
  });

  test("Should navigate to Crafter page", async ({ page }) => {
    await page.getByTestId("crafter-link").click();
    await expect(page).toHaveURL(/.*crafter/);
  });

  test("Should navigate to Wiki page", async ({ page }) => {
    await page.getByTestId("wiki-link").click();
    await expect(page).toHaveURL(/.*wiki/);
  });

  test("Should navigate to Map page", async ({ page }) => {
    await page.getByTestId("map-link").click();
    await expect(page).toHaveURL(/.*map/);
  });

  test("Should change language", async ({ page }) => {
    await page.getByTestId("language-switcher").click();
    await page.getByRole("menuitem", { name: "Español" }).click();
    await expect(
      page.getByRole("heading", { name: /Last Oasis Stiletto/i }),
    ).toBeVisible(); // Check if title is still visible after language change
    // Add more specific assertions for language change if necessary, e.g., checking text content of a specific element
  });
});
