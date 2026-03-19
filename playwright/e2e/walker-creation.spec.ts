import { test, expect } from "@playwright/test";
import { WalkerUse } from "../../src/types/dto/walkers";

const MOCK_CLAN_ID = 1;

const MOCK_USER_DATA = {
  discordid: "leader-discord-id",
  discordtag: "Leader#1234",
  nickname: "ClanLeader",
  clanid: MOCK_CLAN_ID,
  leaderid: "leader-discord-id",
};

const MOCK_MEMBERS = [
  {
    discordid: "leader-discord-id",
    discordtag: "Leader#1234",
    nickname: "ClanLeader",
    leaderid: "leader-discord-id",
  },
  {
    discordid: "walker-owner-id",
    discordtag: "Owner#1234",
    nickname: "WalkerOwner",
    leaderid: "leader-discord-id",
  },
];

const MOCK_ITEMS = [
  {
    name: "Stiletto Walker",
    category: "Walkers",
  },
  {
    name: "Falco Walker",
    category: "Walkers",
  },
  {
    name: "Fiber",
    category: "Resources",
  },
];

test.describe("Walker Creation Flow", () => {
  test("Should create a new walker and send normalized payload", async ({
    page,
  }) => {
    let walkers = [
      {
        discordid: "leader-discord-id",
        walkerid: 100,
        name: "Existing Walker",
        ownerUser: "ClanLeader",
        type: "Stiletto",
        use: WalkerUse.PERSONAL,
        isReady: false,
        description: "Old description",
      },
    ];

    let createWalkerPayload: Record<string, unknown> | null = null;

    await page.route("**/users", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER_DATA),
      });
    });

    await page.route(`**/clans/${MOCK_CLAN_ID}/members`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_MEMBERS),
      });
    });

    await page.route("**/json/items_min.json", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_ITEMS),
      });
    });

    await page.route("**/walkers?**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(walkers),
      });
    });

    await page.route("**/walkers", async (route) => {
      const request = route.request();

      if (request.method() !== "POST") {
        await route.continue();
        return;
      }

      createWalkerPayload = request.postDataJSON();

      walkers = [
        ...walkers,
        {
          discordid: "leader-discord-id",
          walkerid: 101,
          name: (createWalkerPayload?.name as string) ?? "New Walker",
          ownerUser: (createWalkerPayload?.owner as string) ?? "WalkerOwner",
          type: (createWalkerPayload?.type as string) ?? "Stiletto",
          use: (createWalkerPayload?.use as WalkerUse) ?? WalkerUse.PERSONAL,
          isReady: Boolean(createWalkerPayload?.ready),
          description:
            (createWalkerPayload?.description as string) ?? "No description",
        },
      ];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Walker created successfully" }),
      });
    });

    await page.addInitScript(() => {
      globalThis.localStorage.setItem("token", "mock-test-token");
      globalThis.localStorage.setItem("discordid", "leader-discord-id");
    });

    await page.goto("/clan/walkers");

    await expect(page.getByRole("button", { name: "Add" })).toBeVisible(
      {
        timeout: 15000,
      },
    );

    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.locator("#create-walker-name")).toBeVisible();

    await page.locator("#create-walker-name").fill("   Fresh Walker   ");
    await page.locator("#create-walker-owner").fill("  WalkerOwner  ");
    await page.locator("#create-walker-type").selectOption("Stiletto");
    await page.locator("#create-walker-use").selectOption(WalkerUse.PERSONAL);
    await page.locator("#create-walker-ready").check();
    await page
      .locator("#create-walker-description")
      .fill("  Ready for farming  ");

    await page.locator("form button[type='submit']").click();

    await expect.poll(() => createWalkerPayload).not.toBeNull();
    expect(createWalkerPayload).toEqual({
      name: "Fresh Walker",
      owner: "WalkerOwner",
      use: WalkerUse.PERSONAL,
      ready: true,
      type: "Stiletto",
      description: "Ready for farming",
    });

    await expect(page.locator("#create-walker-name")).not.toBeVisible();
    await expect(page.getByText("Fresh Walker")).toBeVisible();
  });
});
