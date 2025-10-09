import { test, expect } from "@playwright/test";
import { TradeType } from "../../src/types/dto/trades";

test.describe("Trades Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/trades?**", async (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              idtrade: 1,
              discordid: "0000000000000",
              type: TradeType.Supply,
              resource: "Test Item 1",
              amount: 10,
              nickname: "Random#0",
              discordtag: "Random#0",
              price: 100,
            },
            {
              idtrade: 2,
              discordid: "0000000000001",
              type: TradeType.Supply,
              resource: "Another Item",
              amount: 5,
              nickname: "Random#1",
              discordtag: "Random#1",
              price: 50,
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });

    await page.route("**/trades", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Trade created successfully" }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route("**/clusters", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              region: "EU",
              name: "Official",
              clan_limit: 999,
              crossplay: true,
            },
            {
              region: "EU",
              name: "Xbox",
              clan_limit: 999,
              crossplay: true,
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    await page.getByTestId("trades-link").click();
  });

  test("should display trades list on load", async ({ page }) => {
    await expect(page.getByText("Test Item 1")).toBeVisible();
    await expect(page.getByText("Another Item")).toBeVisible();
  });

  test("should show post trade form when user is connected", async ({
    page,
  }) => {
    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          discordtag: "testUser#1234",
          nickname: "TestNickname",
        }),
      });
    });

    await page.evaluate(() => {
      localStorage.setItem("token", "fake-user-token");
      localStorage.setItem("discordid", "fake-discord-id");
    });
    await page.reload();

    // The form should be visible directly when the user is connected
    await expect(page.getByTestId("create-trade-form")).toBeVisible();

    // Check for form fields using data-testid
    await expect(page.getByTestId("trade-type")).toBeVisible();
    await expect(page.getByTestId("resource-type")).toBeVisible();
    await expect(page.getByTestId("region-input")).toBeVisible();
    await expect(page.getByTestId("amount-input")).toBeVisible();
    await expect(page.getByTestId("price-input")).toBeVisible();
  });

  test("should not show post trade form when user is not connected", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("discordid");
    });
    await page.reload();

    await expect(
      page.getByRole("button", { name: "Post New Trade" }),
    ).not.toBeVisible();
    await expect(page.getByTestId("not-logged-in-message")).toBeVisible();
  });

  test("should allow a connected user to create a new trade", async ({
    page,
  }) => {
    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          discordtag: "testUser#1234",
          nickname: "TestNickname",
        }),
      });
    });

    await page.evaluate(() => {
      localStorage.setItem("token", "fake-user-token");
      localStorage.setItem("discordid", "fake-discord-id");
    });

    await page.route("**/items_min.json", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { name: "Aloe Vera", category: "Resource" },
          { name: "Wood", category: "Resource" },
          { name: "Stone", category: "Resource" },
        ]),
      });
    });

    await page.reload();

    await expect(page.getByTestId("create-trade-form")).toBeVisible();

    const tradeData = {
      type: TradeType.Supply,
      resource: "Aloe Vera",
      region: "Official", // Assuming 'Official' is a valid value from the mocked /clusters
      amount: 100,
      quality: 2, // Rare
      price: 50,
    };

    // Fill the form
    await page.getByTestId("trade-type").selectOption({ label: "Supply" });
    await page.getByTestId("amount-input").fill(tradeData.amount.toString());
    await page
      .locator("#qualityInput")
      .selectOption({ value: tradeData.quality.toString() });
    await page.getByTestId("price-input").fill(tradeData.price.toString());

    // Capture the POST request to /trades
    let postRequestPayload = null;
    await page.route("**/trades", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        postRequestPayload = request.postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Trade created successfully" }),
        });
      } else {
        // Let other /trades requests (like GET) pass through the original beforeEach mock
        await route.continue();
      }
    });

    // Submit the form
    await page.getByTestId("submit-trade-button").click();

    // Assert the payload of the POST request
    expect(postRequestPayload).not.toBeNull();
  });
});
