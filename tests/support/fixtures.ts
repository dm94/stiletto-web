import type { Page } from "@playwright/test";

const API_URL = process.env.VITE_API_URL;

const interceptAll = async (page: Page): Promise<void> => {
  await interceptItems(page);
  await interceptTrades(page);
  await interceptClans(page);
  await interceptRecipes(page);
  await interceptMap(page);
  await interceptUser(page);
};

const interceptItems = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/items`, async (route) => {
    await route.fulfill({
      status: 200,
      json: [
        {
          name: "Sand Bed",
          category: "Decorations",
          crafting: [
            {
              ingredients: [
                {
                  name: "Wood",
                  count: 10,
                },
                {
                  name: "Fiber",
                  count: 20,
                },
              ],
              station: "Woodworking Station",
              time: 30,
              output: 1,
            },
          ],
        },
        {
          name: "Aloe",
          category: "Resources",
          crafting: null,
        },
        {
          name: "Wood",
          category: "Resources",
          crafting: null,
        },
        {
          name: "Fiber",
          category: "Resources",
          crafting: null,
        },
        {
          name: "Stone",
          category: "Resources",
          crafting: null,
        },
        {
          name: "Woodworking Station",
          category: "Stations",
          crafting: [
            {
              ingredients: [
                {
                  name: "Wood",
                  count: 50,
                },
                {
                  name: "Stone",
                  count: 20,
                },
              ],
              time: 60,
              output: 1,
            },
          ],
        },
        {
          name: "Firefly Walker",
          category: "Walkers",
          crafting: [
            {
              ingredients: [
                {
                  name: "Wood",
                  count: 500,
                },
                {
                  name: "Fiber",
                  count: 300,
                },
              ],
              station: "Walker Assembly Station",
              time: 300,
              output: 1,
            },
          ],
        },
      ],
    });
  });
};

const interceptTrades = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/trades*`, async (route) => {
    await route.fulfill({
      status: 200,
      json: [
        {
          idtrade: "1",
          discordid: "0000000000000000",
          type: "Supply",
          resource: "Cattail",
          amount: "100",
          quality: "0",
          region: "EU-Official",
          price: "10",
          nickname: "Test",
          discordtag: "test#54563",
        },
        {
          idtrade: "2",
          discordid: "1111111111111111",
          type: "Supply",
          resource: "Wood",
          amount: "500",
          quality: "0",
          region: "EU-Official",
          price: "5",
          nickname: "Trader1",
          discordtag: "trader1#1234",
        },
        {
          idtrade: "3",
          discordid: "2222222222222222",
          type: "Demand",
          resource: "Aloe Vera",
          amount: "200",
          quality: "0",
          region: "NA-East",
          price: "15",
          nickname: "Trader2",
          discordtag: "trader2#5678",
        },
        {
          idtrade: "4",
          discordid: "3333333333333333",
          type: "Supply",
          resource: "Rupu Gel",
          amount: "50",
          quality: "0",
          region: "EU-Official",
          price: "25",
          nickname: "Trader3",
          discordtag: "trader3#9012",
        },
        {
          idtrade: "5",
          discordid: "4444444444444444",
          type: "Demand",
          resource: "Bone Splinter",
          amount: "300",
          quality: "0",
          region: "NA-West",
          price: "8",
          nickname: "Trader4",
          discordtag: "trader4#3456",
        },
        {
          idtrade: "6",
          discordid: "5555555555555555",
          type: "Supply",
          resource: "Fiber",
          amount: "1000",
          quality: "0",
          region: "EU-Official",
          price: "3",
          nickname: "Trader5",
          discordtag: "trader5#7890",
        },
        {
          idtrade: "7",
          discordid: "6666666666666666",
          type: "Demand",
          resource: "Nomad Cloth",
          amount: "100",
          quality: "1",
          region: "EU-Official",
          price: "50",
          nickname: "Trader6",
          discordtag: "trader6#1234",
        },
        {
          idtrade: "8",
          discordid: "7777777777777777",
          type: "Supply",
          resource: "Ceramic Shard",
          amount: "200",
          quality: "0",
          region: "Asia",
          price: "12",
          nickname: "Trader7",
          discordtag: "trader7#5678",
        },
        {
          idtrade: "9",
          discordid: "8888888888888888",
          type: "Demand",
          resource: "Stone",
          amount: "2000",
          quality: "0",
          region: "EU-Official",
          price: "2",
          nickname: "Trader8",
          discordtag: "trader8#9012",
        },
        {
          idtrade: "10",
          discordid: "9999999999999999",
          type: "Supply",
          resource: "Iron Ore",
          amount: "500",
          quality: "0",
          region: "EU-Official",
          price: "20",
          nickname: "Trader9",
          discordtag: "trader9#3456",
        },
      ],
    });
  });

  await page.route(`${API_URL}/clusters*`, async (route) => {
    await route.fulfill({
      status: 200,
      json: [
        { region: "EU", name: "Official", clan_limit: "999", crossplay: "1" },
        { region: "EU", name: "Xbox", clan_limit: "999", crossplay: "1" },
        {
          region: "NA-EAST",
          name: "Official",
          clan_limit: "999",
          crossplay: "1",
        },
        {
          region: "NA-EAST",
          name: "Xbox",
          clan_limit: "999",
          crossplay: "1",
        },
        {
          region: "NA-WEST",
          name: "Official",
          clan_limit: "999",
          crossplay: "1",
        },
        {
          region: "OCE",
          name: "Official",
          clan_limit: "999",
          crossplay: "1",
        },
        {
          region: "Private",
          name: "Unofficial",
          clan_limit: "999",
          crossplay: "1",
        },
        {
          region: "RUSSIA",
          name: "Official",
          clan_limit: "999",
          crossplay: "1",
        },
        { region: "SA", name: "Official", clan_limit: "999", crossplay: "1" },
        {
          region: "SEA",
          name: "Official",
          clan_limit: "999",
          crossplay: "1",
        },
      ],
    });
  });
};

const interceptClans = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/clans*`, async (route) => {
    await route.fulfill({
      status: 202,
      json: [
        {
          clanid: "1",
          name: "Stiletto Clan",
          discordid: "000000000000",
          leaderid: "000000000000000",
          invitelink: "12345",
          recruitment: "1",
          flagcolor: "#ffffff",
          symbol: "C1",
          region: "EU-Official",
          discordTag: "TEST#12345",
        },
      ],
    });
  });
};

const interceptRecipes = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/recipes*`, async (route) => {
    const fixtureDate = {
      token: "63e00d26982e2b509d5cde92",
      items: JSON.parse('[{"name":"Sand Bed","count":1}]'),
    };
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 201, json: fixtureDate });
    } else if (route.request().method() === "GET") {
      await route.fulfill({ status: 200, json: fixtureDate });
    } else {
      await route.continue();
    }
  });
};

const interceptMap = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/maps/*/resources*`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: [
          {
            resourceid: null,
            mapid: null,
            resourcetype: null,
            quality: null,
            x: null,
            y: null,
            token: null,
            description: null,
            lastharvested: null,
            typemap: "MiniOasis_new",
          },
        ],
      });
    } else if (route.request().method() === "POST") {
      await route.fulfill({
        status: 202,
        json: { Success: "Added resource" },
      });
    } else if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 204 });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_URL}/maps`, async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        json: {
          Success: "Map created",
          IdMap: "1",
          PassMap: "fsdfdsfdsfdsfdewr",
        },
      });
    } else if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: {
          mapid: "1",
          typemap: "MiniOasis_new",
          discordID: "0000000000000000",
          name: "TEST",
          dateofburning: "2050-01-01",
          pass: "1234567890",
          allowedit: "1",
        },
      });
    } else {
      await route.continue();
    }
  });
};

const interceptUser = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/users*`, async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        nickname: "Stiletto",
        discordtag: "TEST#12345",
        discordid: "000000000000",
        clanid: null,
        clanname: null,
        leaderid: null,
        serverdiscord: null,
      },
    });
  });
};

export const interceptRequests = async (page: Page): Promise<void> => {
  await interceptAll(page);
};
