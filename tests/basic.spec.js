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

test("score entry page", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Enter scores" }).click();

  const buttons = page.getByRole("button");
  const inputs = page.getByRole("spinbutton");
  await expect(buttons).toHaveCount(16);
  await expect(inputs).toHaveCount(4);

  await expect(page).toHaveURL("/score-entry.html");
});

test("back button goes back", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Enter scores" }).click();
  await expect(page).toHaveURL("/score-entry.html");

  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(page).toHaveTitle("Potterscore");
  await expect(page.getByRole("button")).toHaveCount(2);
});
