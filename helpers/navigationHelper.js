import { expect } from "@playwright/test";
import { baseUrl } from "../constants";
import { loginWithVerifCode } from "./loginHelper";
import myBookings from "../pageElements/app/myBookings.json" assert { type: "json" };

export const goToMyBookings = async (page, context) => {
  await loginWithVerifCode(page, context);

  await page.locator(myBookings.myBookingsButton).click();

  await expect(page).toHaveURL(/trip\/manage/);
};
