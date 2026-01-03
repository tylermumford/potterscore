import { test, expect } from "./fixtures";

test("add score with button", async ({ partyDisplayPage, scoreEntryPage }) => {
  await scoreEntryPage.getByRole("button", { name: "+5" }).first().click();

  await expect(partyDisplayPage.getByText("5")).toBeVisible();
});
