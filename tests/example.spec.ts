import { test, expect } from "@playwright/test";

test("basic navigation", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page).toHaveTitle("Stiletto for the Last Oasis");
  await expect(page.locator("body")).not.toBeEmpty();
});
