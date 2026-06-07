import { expect } from "@playwright/test";
import { userProfileURL } from "../constants.js";
import { loginWithVerifCode } from "./loginHelper.js";
import userProfile from "../pageElements/app/userProfile.json" assert { type: "json" };

export const goToUserBookings = async (page, context) => {
  await loginWithVerifCode(page, context);

  await page.locator(userProfile.myBookingsButton).click();

  await expect(page).toHaveURL(/trip\/manage/);
};

export const goToUserProfile = async (page, context, pagePath) => {
  await goToUserBookings(page, context);

  await page.locator(userProfile.myAccountMenu).click();

  const pageURL = `${userProfileURL}/${pagePath}`;
  await expect(page).toHaveURL(pageURL);
};
