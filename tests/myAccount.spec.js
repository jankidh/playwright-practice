import { test, expect } from "@playwright/test";
import { goToUserProfile } from "../helpers/navigationHelper.js";
import userProfile from "../pageElements/app/userProfile.json" assert { type: "json" };

test("My account - page element verification", async ({ page, context }) => {
  await goToUserProfile(page, context, "account");
  await expect(page.locator(".app-container__title")).toHaveText("My Account");
});
