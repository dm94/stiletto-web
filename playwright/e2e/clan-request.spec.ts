import { test, expect } from "@playwright/test";
import type { ClanInfo } from "../../src/types/dto/clan";

const MOCK_USER_DATA = {
  discordtag: "testUser#1234",
  nickname: "TestNickname",
};

const MOCK_CLANS_DATA: ClanInfo[] = [
  {
    clanid: 1,
    name: "Test Clan 1",
    leaderid: "12345678901234",
    recruitment: true,
    region: "EU-Official",
    discordTag: "Leader#1234",
    invitelink: "testinvite1",
    flagcolor: "#FF5500",
    symbol: "C1",
  },
  {
    clanid: 2,
    name: "Test Clan 2",
    leaderid: "98765432109876",
    recruitment: true,
    region: "NA-Official",
    discordTag: "Leader#5678",
    invitelink: "testinvite2",
    flagcolor: "#00FF55",
    symbol: "C2",
  },
];

test.describe("Clan Request Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER_DATA),
      });
    });

    await page.route("**/clans?**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CLANS_DATA),
      });
    });

    await page.route("**/clans/*/requests?**", async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Request sent successfully",
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route("**/clusters", async (route) => {
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
            region: "NA",
            name: "Official",
            clan_limit: 999,
            crossplay: true,
          },
        ]),
      });
    });

    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mock-test-token");
      window.localStorage.setItem("discordid", "mock-discord-id");
    });
  });

  test("Should navigate to clan list and send a request to join a clan", async ({
    page,
  }) => {
    await page.goto("/clanlist");
    await expect(page.url()).toContain("/clanlist");
    
    await expect(page.getByText(MOCK_CLANS_DATA[0].name)).toBeVisible();
    await expect(page.getByText(MOCK_CLANS_DATA[1].name)).toBeVisible();

    await page.getByTestId("send-request-button").first().click();
    await expect(page.getByText("Request Message")).toBeVisible();

    const requestMessage = "I would like to join your clan!";
    await page.locator("#modalTextArea").fill(requestMessage);

    await page.getByTestId("submit-request-button").click();

    await expect(
      page.getByText("Application to enter the clan sent"),
    ).toBeVisible();
  });

  test("Should not show send request button when user is not logged in", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("discordid");
    });

    await page.goto("/clanlist");
    await expect(page.getByText(MOCK_CLANS_DATA[0].name)).toBeVisible();

    await expect(page.getByTestId("send-request-button")).not.toBeVisible({
      timeout: 5000,
    });
  });
});
