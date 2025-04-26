/**
 * Utilities for loading fixtures and handling network interceptions in Playwright
 * Replaces the functionality of commands.js from Cypress
 */
import type { Page } from "@playwright/test";

/**
 * Sets up all network interceptions needed for tests
 */
export async function setupNetworkInterceptions(page: Page): Promise<void> {
  await interceptItems(page);
  await interceptTrades(page);
  await interceptClans(page);
  await interceptImages(page);
  await interceptRecipes(page);
  await interceptMaps(page);
}

/**
 * Intercepts item requests
 */
export async function interceptItems(page: Page): Promise<void> {
  await page.route("**/items", async (route) => {
    await route.fulfill({ path: "../fixtures/items.json" });
  });
}

/**
 * Intercepts trade requests
 */
export async function interceptTrades(page: Page): Promise<void> {
  await page.route("**/trades*", async (route) => {
    await route.fulfill({ path: "../fixtures/trades.json" });
  });

  await page.route("**/clusters*", async (route) => {
    await route.fulfill({ path: "../fixtures/clusters.json" });
  });
}

/**
 * Intercepts clan requests
 */
export async function interceptClans(page: Page): Promise<void> {
  await page.route("**/clans*", async (route) => {
    await route.fulfill({
      status: 202,
      path: "../fixtures/clans.json",
    });
  });
}

/**
 * Intercepts image requests
 */
export async function interceptImages(page: Page): Promise<void> {
  await page.route("**/items/*", async (route) => {
    await route.fulfill({ path: "../fixtures/aloe.png" });
  });

  await page.route("**/symbols/*", async (route) => {
    await route.fulfill({ path: "../fixtures/aloe.png" });
  });

  await page.route("**/maps/*", async (route) => {
    await route.fulfill({ path: "../fixtures/map.jpg" });
  });
}

/**
 * Intercepts recipe requests
 */
export async function interceptRecipes(page: Page): Promise<void> {
  await page.route("**/recipes*", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        path: "../fixtures/recipes.json",
      });
    } else if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        path: "../fixtures/recipes.json",
      });
    }
  });
}

/**
 * Intercepts map requests
 */
export async function interceptMaps(page: Page): Promise<void> {
  await page.route("**/maps/*/resources*", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        path: "../fixtures/get-resources.json",
      });
    } else if (route.request().method() === "POST") {
      await route.fulfill({
        status: 202,
        path: "../fixtures/add-resource-map.json",
      });
    } else if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 204 });
    }
  });

  await page.route("**/maps", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        path: "../fixtures/add-map.json",
      });
    } else if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        path: "../fixtures/get-map.json",
      });
    }
  });
}

/**
 * Intercepts user requests
 */
export async function interceptUserRequests(page: Page): Promise<void> {
  await page.route("**/users*", async (route) => {
    await route.fulfill({
      status: 200,
      path: "../fixtures/users.json",
    });
  });
}

/**
 * Waits for the page to fully load
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
}

/**
 * Checks if an element is visible
 */
export async function isVisible(
  page: Page,
  selector: string,
): Promise<boolean> {
  const element = page.locator(selector);
  try {
    await element.waitFor({ state: "visible", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Clicks on an element if it exists
 */
export async function clickIfExists(
  page: Page,
  selector: string,
): Promise<void> {
  if (await isVisible(page, selector)) {
    await page.locator(selector).click();
  }
}
