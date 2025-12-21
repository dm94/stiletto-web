import { test, expect } from "@playwright/test";
import type { ClanInfo } from "../../src/types/dto/clan";
import type { GenericResponse } from "../../src/types/dto/generic";

const MOCK_USER_DATA = {
  discordtag: "testLeader#1234",
  nickname: "ClanLeader",
  discordid: "leader-discord-id",
  clanid: 1,
  leaderid: "leader-discord-id",
};

const MOCK_CLAN_ID = 1;

const MOCK_CLAN_DATA: ClanInfo = {
  clanid: MOCK_CLAN_ID,
  name: "Test Clan",
  leaderid: MOCK_USER_DATA.discordid,
  recruitment: true,
  region: "EU-Official",
  discordTag: MOCK_USER_DATA.discordtag,
  invitelink: "testinvite",
  flagcolor: "#FF5500",
  symbol: "C1",
};

const MOCK_UPDATED_CLAN_DATA = {
  name: "Updated Clan Name",
  recruitment: false,
  invitelink: "updatedinvite",
  flagcolor: "#00FF55",
  symbol: "C2",
};

const MOCK_UPDATE_RESPONSE: GenericResponse = {
  message: "Clan updated successfully",
};

test.describe("Clan Edit Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Configure mocks for API requests
    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER_DATA),
      });
    });

    await page.route(`**/clans/${MOCK_CLAN_ID}*`, (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_CLAN_DATA),
        });
      } else if (request.method() === "PUT") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_UPDATE_RESPONSE),
        });
      } else {
        route.continue();
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

    await page.route(`**/clans/${MOCK_CLAN_ID}/members`, (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              discordid: "member1-discord-id",
              discordtag: "Member1#1234",
              nickname: "ClanMember1",
              leaderid: MOCK_USER_DATA.discordid,
            },
            {
              discordid: MOCK_USER_DATA.discordid,
              discordtag: MOCK_USER_DATA.discordtag,
              nickname: MOCK_USER_DATA.nickname,
              leaderid: MOCK_USER_DATA.discordid,
            },
          ]),
        });
      } else {
        route.continue();
      }
    });

    await page.route(`**/clans/${MOCK_CLAN_ID}/requests`, (route) => {
      const request = route.request();
      if (request.method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              discordid: "987654321098765",
              discordtag: "TestUser#5678",
              message: "I would like to join the clan",
              leaderid: MOCK_USER_DATA.discordid,
            },
          ]),
        });
      } else {
        route.continue();
      }
    });

    await page.route(
      `**/clans/${MOCK_CLAN_ID}/members/*/permissions`,
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            bot: true,
            request: true,
            kickmembers: true,
            editclan: true,
          }),
        });
      },
    );

    // Set up localStorage before navigation
    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mock-test-token");
      window.localStorage.setItem("discordid", "leader-discord-id");
    });
  });

  test("Should navigate to members page and edit clan information", async ({
    page,
  }) => {
    await page.goto("/members");

    const editButton = page.getByTestId("edit-clan-button");
    await editButton.waitFor({ state: "visible", timeout: 30000 });
    await editButton.click();

    const clanNameInput = page.locator("#clan_name");
    await clanNameInput.waitFor({ state: "visible", timeout: 30000 });

    await clanNameInput.fill(MOCK_UPDATED_CLAN_DATA.name);

    const recruitCheckbox = page.locator("#recruitmentInput");
    await recruitCheckbox.waitFor({ state: "visible", timeout: 30000 });
    if (await recruitCheckbox.isChecked()) {
      await recruitCheckbox.uncheck();
    }

    const discordInput = page.locator("#discord_invite");
    await discordInput.waitFor({ state: "visible", timeout: 30000 });
    await discordInput.fill(MOCK_UPDATED_CLAN_DATA.invitelink);

    const putRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes(`/clans/${MOCK_CLAN_ID}`) &&
        request.method() === "PUT",
    );

    const submitButton = page.getByTestId("submit-button");
    await submitButton.waitFor({ state: "visible", timeout: 30000 });
    await submitButton.click();

    await putRequestPromise;

    await expect(clanNameInput).not.toBeVisible({ timeout: 30000 });
  });
});
