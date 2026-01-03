import { test as base } from "@playwright/test";

export const test = base.extend({
  scoreEntryPage: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto("/score-entry.html");
    await use(page);
  },
  partyDisplayPage: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto("/party-display.html");
    await use(page);
  },
});

export { expect } from "@playwright/test";
