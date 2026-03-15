import { expect, test, type Page } from "@playwright/test";

const ROOT_TAB_NAME = "Artillerist";
const FIRST_PERK = "Boltmaster I";
const SECOND_PERK = "Boltmaster II";

const escapeRegex = (text: string): string =>
  text.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSummaryValue = async (page: Page, label: string): Promise<number> => {
  const summaryRow = page.locator("aside p", { hasText: label }).first();
  await expect(summaryRow).toBeVisible();
  const summaryText = (await summaryRow.textContent()) ?? "";
  const matchedValue = summaryText.match(/(\d+)\s*$/);

  expect(matchedValue).not.toBeNull();

  return Number(matchedValue?.[1] ?? "0");
};

const expectSummaryValue = async (
  page: Page,
  label: string,
  expectedValue: number,
): Promise<void> => {
  const actualValue = await getSummaryValue(page, label);
  expect(actualValue).toBe(expectedValue);
};

const navigateToPerks = async (page: Page): Promise<void> => {
  await page.goto("/");
  await page.getByTestId("perks-link").click();
  await expect(page).toHaveURL(/\/perks/);
  await expect(page.getByRole("tablist", { name: "Perk roots" })).toBeVisible();
};

const getPerkNode = (page: Page, perkName: string) =>
  page.getByRole("button", { name: `Perk node ${perkName}`, exact: true });

test.describe("Perk cost calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await navigateToPerks(page);
    await page.getByRole("tab", { name: ROOT_TAB_NAME }).click();
  });

  test("shows default summary values on first load", async ({ page }) => {
    await expectSummaryValue(page, "Total points", 0);
    await expectSummaryValue(page, "Selected perks", 0);
    await expectSummaryValue(page, "Next incremental cost", 5);
    await expect(page.getByText("No perks selected yet.")).toBeVisible();
  });

  test("updates summary and aria state when selecting and deselecting perks", async ({
    page,
  }) => {
    const firstPerkNode = getPerkNode(page, FIRST_PERK);
    const secondPerkNode = getPerkNode(page, SECOND_PERK);

    await expect(firstPerkNode).toHaveAttribute("aria-pressed", "false");
    await expect(secondPerkNode).toHaveAttribute("aria-pressed", "false");

    await firstPerkNode.click();
    await expect(firstPerkNode).toHaveAttribute("aria-pressed", "true");
    await expectSummaryValue(page, "Total points", 5);
    await expectSummaryValue(page, "Selected perks", 1);
    await expectSummaryValue(page, "Next incremental cost", 4);

    await secondPerkNode.click();
    await expect(secondPerkNode).toHaveAttribute("aria-pressed", "true");
    await expectSummaryValue(page, "Total points", 9);
    await expectSummaryValue(page, "Selected perks", 2);
    await expectSummaryValue(page, "Next incremental cost", 3);

    await firstPerkNode.click();
    await expect(firstPerkNode).toHaveAttribute("aria-pressed", "false");
    await expect(secondPerkNode).toHaveAttribute("aria-pressed", "false");
    await expectSummaryValue(page, "Total points", 0);
    await expectSummaryValue(page, "Selected perks", 0);
    await expect(page.getByText("No perks selected yet.")).toBeVisible();
  });

  test("keeps selected perks after reload using storage state", async ({ page }) => {
    await getPerkNode(page, FIRST_PERK).click();
    await getPerkNode(page, SECOND_PERK).click();

    await page.reload();
    await expect(page.getByRole("tablist", { name: "Perk roots" })).toBeVisible();

    await expect(getPerkNode(page, FIRST_PERK)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(getPerkNode(page, SECOND_PERK)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expectSummaryValue(page, "Total points", 9);
    await expectSummaryValue(page, "Selected perks", 2);
  });

  test("shares build in querystring and supports reset", async ({ page }) => {
    await getPerkNode(page, FIRST_PERK).click();

    await page.getByRole("button", { name: "Share build" }).click();
    await expect(page).toHaveURL(/build=/);

    const shareInput = page.locator("#perk-share-link");
    await expect(shareInput).toHaveValue(/build=/);
    await expect(page.locator("output[aria-live='polite']")).toContainText(
      /Build link copied|Build link ready to copy/,
    );

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page).not.toHaveURL(/build=/);
    await expectSummaryValue(page, "Total points", 0);
    await expectSummaryValue(page, "Selected perks", 0);
    await expect(page.locator("output[aria-live='polite']")).toContainText(
      "Build reset",
    );
    await expect(shareInput).toHaveValue(
      new RegExp(`${escapeRegex("/perks?build=")}`),
    );
  });

  test("navigates roots with keyboard arrows", async ({ page }) => {
    const activeTab = page.getByRole("tab", { selected: true });
    const initialTabName = (await activeTab.textContent())?.trim() ?? "";

    await activeTab.focus();
    await page.keyboard.press("ArrowRight");

    const nextActiveTab = page.getByRole("tab", { selected: true });
    const nextTabName = (await nextActiveTab.textContent())?.trim() ?? "";

    expect(nextTabName).not.toBe(initialTabName);
    await expect(nextActiveTab).toBeFocused();
  });
});
