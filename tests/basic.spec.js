import { test, expect } from "@playwright/test";

test("basic page load", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Potterscore");
});
