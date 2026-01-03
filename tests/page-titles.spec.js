import { test, expect } from "./fixtures";

const sitemap = new Map();
sitemap.set("/", "Potterscore");
sitemap.set("/score-entry.html", "Potterscore: Score Entry");
sitemap.set("/party-display.html", "Potterscore: Party Display");

for (const [url, title] of sitemap) {
  test(`page title '${title}`, async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveTitle(title);
  });
}
