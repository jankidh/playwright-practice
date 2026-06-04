import { test, expect } from "@playwright/test";
import { goToMyBookings } from "../helpers/navigationHelper";
import myBookings from "../pageElements/app/myBookings.json" assert { type: "json" };

test("User can open My Account", async ({ page, context }) => {
  await goToMyBookings(page, context);

  await page.locator(myBookings.myAccountMenu).click();

  await expect(page).toHaveURL(/myryanair\/account/);
  await expect(page.locator(".app-container__title")).toHaveText("My account");
});
