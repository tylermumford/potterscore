import { test, expect } from "@playwright/test";

test("basic page load", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Potterscore");
});

test("fancy background", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "View scores" }).click();

  await expect(page.getByRole("img", { name: "Background" })).toBeVisible();
});
