import { test, expect } from "@playwright/test";
import type { MemberRequest } from "../../src/types/dto/members";
import type { GenericResponse } from "../../src/types/dto/generic";
import type { RequestAction } from "../../src/types/dto/requests";

const MOCK_USER_DATA = {
  discordtag: "testLeader#1234",
  nickname: "ClanLeader",
  discordid: "0000000000000000",
};

const MOCK_CLAN_ID = 1;

const MOCK_REQUESTS_DATA: MemberRequest[] = [
  {
    discordid: "987654321098765",
    discordtag: "TestUser#5678",
    message: "Me gustaría unirme al clan",
    leaderid: MOCK_USER_DATA.discordid,
  },
  {
    discordid: "123456789012345",
    discordtag: "AnotherUser#9012",
    message: "Solicitud para unirme",
    leaderid: MOCK_USER_DATA.discordid,
  },
];

const MOCK_ACCEPT_RESPONSE: GenericResponse = {
  message: "Member accepted successfully",
};

test.describe("Clan Member Acceptance Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/users", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...MOCK_USER_DATA,
          clanid: MOCK_CLAN_ID,
          leaderid: "leader-discord-id",
          discordid: "leader-discord-id",
        }),
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
              discordid: "leader-discord-id",
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
          body: JSON.stringify(MOCK_REQUESTS_DATA),
        });
      } else {
        route.continue();
      }
    });

    await page.route(`**/clans/${MOCK_CLAN_ID}/requests/*`, (route) => {
      const request = route.request();
      if (request.method() === "PUT") {
        const url = new URL(request.url());
        const action = url.searchParams.get("action") as RequestAction;

        if (action === "accept") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(MOCK_ACCEPT_RESPONSE),
          });
        } else {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ message: "Request rejected" }),
          });
        }
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
          }),
        });
      },
    );

    await page.addInitScript(() => {
      window.localStorage.setItem("token", "mock-test-token");
      window.localStorage.setItem("discordid", "leader-discord-id");
    });
  });

  test("Should navigate to members page and accept a pending request", async ({
    page,
  }) => {
    await page.goto("/members");

    await page.waitForLoadState("networkidle", { timeout: 15000 });

    const testUserRequest = page.getByText("TestUser#5678");
    await expect(testUserRequest).toBeVisible();

    const requestRow = page.locator("tr", {
      has: page.getByText("TestUser#5678"),
    });
    const showRequestButton = requestRow.getByRole("button");
    await expect(showRequestButton).toBeVisible();
    await showRequestButton.click();

    const requestModal = page.getByText("Me gustaría unirme al clan");
    await expect(requestModal).toBeVisible();

    const acceptButton = page.getByTestId("accept-request-button");
    await expect(acceptButton).toBeVisible();

    const putRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes(`/clans/${MOCK_CLAN_ID}/requests/`) &&
        request.method() === "PUT",
    );

    await acceptButton.click();

    await putRequestPromise;

    await expect(testUserRequest).not.toBeVisible({ timeout: 5000 });
  });
});
